class PromiseQueue {

    constructor(tasks = [], concurrentTasks = 1) {

        this.concurrentTasks = concurrentTasks;
        this.toDo = tasks;
        this.running = [];
        this.done = [];
    }

    get #getNewtask() {

        return (
            this.running.length < this.concurrentTasks // se ejecutan x cantidad de tareas concurrentes que no superen al numero permitodo de tareas councurrentes
        ) && this.toDo.length; // y que en la lista de pendientes haya algo.
    }

    run() {

        while (this.#getNewtask) {

            const taskFactory = this.toDo.shift(); // se elimina la ultima tarea insertada en las pendientes.
            const currentPromise = taskFactory(); 
            this.running.push(currentPromise);

            currentPromise
                .then(() => {
                    console.log(
                        "Promesa completada"
                    );
                    this.done.push(currentPromise);
                })
                .catch(console.error)
                .finally(() => {
                    // remover promesa terminada
                    this.running =
                        this.running.filter(
                            p => p !== currentPromise
                        );
                    // intentar ejecutar siguiente
                    this.run();
                });
        }

        console.log({
            running: this.running.length,
            done: this.done.length
        });
    }
}

export default PromiseQueue;