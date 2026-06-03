import { Transform } from "node:stream";

export class ConcurrentStream extends Transform {

    #processChunk;
    #activeTasks;
    #finalizeCallback;
    constructor(processChunk, options = {}) {
        // processChunk funcion asincrona que procesa chunks 

        super({
            objectMode: true, // procesa chunks como objetos de Javascript,
            ...options
        });

        this.#processChunk = processChunk;
        this.#activeTasks = 0;
        this.#finalizeCallback = null;
    }


    _transform(chunk, enc = 'utf-8', callback) {

        this.#activeTasks++;
        // implementacion asincrona de streams
        this.#processChunk(chunk, enc, this.push.bind(this), this._taskComplete.bind(this));
        // esto se ejecuta de inmediato
        callback();
    }
    _flush(callback) {
        if (this.#activeTasks > 0) {
            this.#finalizeCallback = callback;
        } else {
            callback();
        }
    }

    _taskComplete(error) {
        this.#activeTasks--;

        if (error) {
            return this.emit("error", error);
        }

        if (this.#activeTasks === 0 && this.#finalizeCallback) {
            this.#finalizeCallback();
        }
    }
}