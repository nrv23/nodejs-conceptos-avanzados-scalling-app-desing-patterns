import { Transform } from "node:stream";

export class ConcurrentStreamLimitConcurrency extends Transform {

    #processChunk;
    #activeTasks;
    #finalizeCallback;
    #concurrentTasks;
    #toDo;
    #running;
    #done;
    #currentTask;
    #pending;
    #countConcurrentTasks;
    constructor(processChunk, options = {}, concurrentTasks) {
        // processChunk funcion asincrona que procesa chunks 

        super({
            objectMode: true, // procesa chunks como objetos de Javascript,
            ...options
        });

        this.#processChunk = processChunk;
        this.#activeTasks = 0;
        this.#finalizeCallback = null;
        this.#concurrentTasks = concurrentTasks;
        this.#toDo = [];
        this.#running = [];
        this.#done = [];
        this.#pending = [];
        this.#countConcurrentTasks = 0;
    }

    _transform(chunk, enc = 'utf-8', callback) {
        this.#toDo.push(chunk);

        if (this.#_executeTask) {
            const currentChunk = this.#toDo.shift();
            this.#activeTasks++;
            this.#countConcurrentTasks++;
            // logs de informacion
            console.log('ejecutando chunk concurrent');
            // console.log({ countConcurrentTasks: this.#countConcurrentTasks })
            // ---------------------------------------
            this.#currentTask = chunk;
            this.#running.push(currentChunk);
            // implementacion asincrona de streams
            this.#processChunk(chunk, enc, this.push.bind(this), this._taskComplete.bind(this));
            // Le decimos al stream que nos mande el siguiente chunk
            callback();

        } else {
            console.log('guardar tarea pendiente');
            this.#countConcurrentTasks = 0;
            // console.log({ countConcurrentTasks: this.#countConcurrentTasks })
            this.#pending.push({
                chunk: chunk,
                enc,
                callback
            });
            // OJO: No llamamos a callback() aquí. Esto crea el backpressure
            // pausando la llegada de nuevos chunks hasta que se procese uno pendiente.
        }
    }
    _flush(callback) {
        if (this.#activeTasks > 0) {
            this.#finalizeCallback = callback;
        } else {
            callback();
        }
    }

    get #_executeTask() {
        return (
            this.#running.length < this.#concurrentTasks // se ejecutan x cantidad de tareas concurrentes que no superen al numero permitodo de tareas councurrentes
        ) && this.#toDo.length// y que en la lista de pendientes haya algo.
    }

    _taskComplete(error) {
        this.#activeTasks--;

        if (error) {
            return this.emit("error", error);
        }

        this.#done.push(this.#running.shift());

        // AQUÍ: Revisamos si hay tareas pendientes en la cola para ejecutarlas
        if (this.#pending.length > 0) {
            const nextTask = this.#pending.shift();
            this.#activeTasks++;

            this.#currentTask = nextTask.chunk;
            this.#running.push(this.#toDo.shift());

            this.#processChunk(
                nextTask.chunk,
                nextTask.enc,
                this.push.bind(this),
                this._taskComplete.bind(this)
            ).then(() => {
                this.#activeTasks--;
                console.log({
                    pendingLength: this.#pending.length,
                    runningLength: this.#running.length,
                    doneLength: this.#done.length,
                    activeTasks: this.#activeTasks
                })
            });

            // Al llamar al callback de la tarea pendiente aquí, reactivamos el flujo del stream
            // indicando que ya hicimos espacio para que envíe más chunks.
            nextTask.callback();
        }

        if (this.#activeTasks === 0 && this.#finalizeCallback) {
            this.#finalizeCallback();
        }
    }
}