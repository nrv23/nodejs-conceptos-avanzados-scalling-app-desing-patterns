import { fork } from "child_process";

export class ProcessPool {
  constructor(path, max) {
    this.path = path;
    this.max = max;
    this.pool = [];
    this.running = [];
    this.pending = [];
  }

  allocate() {
    return new Promise((resolve, reject) => {
      let worker;
      if (this.pool.length > 0) {
        worker = this.pool.pop(); // elimina y devuelve el ultimo elemento
        this.running.push(worker);
        return resolve(worker);
      }

      if (this.running.length >= this.max) {
        return this.pending.push({ resolve, reject });
      }

      worker = fork(this.path);
      worker.once("message", (message) => {
        if (message === "ready") {
          this.running.push(worker);
          return resolve(worker);
        }
        worker.kill();
        reject(new Error("Failed starting a process."));
      });
      worker.once("exit", (code) => {
        console.log(`Worker exited with code ${code}`);
        this.running = this.running.filter((_worker) => _worker !== worker);
        this.pool = this.pool.filter((_worker) => _worker != worker);
      });
    });
  }

  free(worker) {
    if (this.pending.length > 0) {
      const { resolve } = this.pending.shift(); // elimina y devuelve el primer elemento
      return resolve(worker);
    }
    this.running = this.running.filter((_worker) => _worker !== worker);
    this.pool.push(worker);
  }
}
