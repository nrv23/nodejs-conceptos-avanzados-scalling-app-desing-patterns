import { EventEmitter } from "events";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { ProcessPool } from "./processPool.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const workerPath = join(__dirname, "fibonacciProcessWorker.js");
const workers = new ProcessPool(workerPath, 2);

export class Fibonacci extends EventEmitter {
  constructor(num) {
    super();
    this.num = num;
  }

  async init() {
    const worker = await workers.allocate();
    worker.send({ number: this.num });

    const messageHandler = (msg) => {
      if (msg.event === "end") {
        worker.removeListener("message", messageHandler);
        workers.free(worker);
      }
      this.emit(msg.event, msg.data);
    };

    worker.on("message", messageHandler);
  }
}
