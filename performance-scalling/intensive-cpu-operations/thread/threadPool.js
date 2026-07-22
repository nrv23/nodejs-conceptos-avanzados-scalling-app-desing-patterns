import { Worker } from "worker_threads";

export class ThreadPool {
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
        worker = this.pool.pop();
        this.running.push(worker);
        return resolve(worker);
      }

      if (this.running.length >= this.max) {
        this.pending.push({ resolve, reject });
      }

      worker = new Worker(this.path);
      worker.once("online", () => {
        this.running.push(worker);
        resolve(worker);
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
      const { resolve } = this.pending.shift();
      return resolve(worker);
    }
    this.running = this.running.filter((_worker) => _worker !== worker);
    this.pool.push(worker);
  }
}
