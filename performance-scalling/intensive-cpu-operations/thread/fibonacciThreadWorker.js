import { parentPort } from "worker_threads";
import { Fibonacci } from "../fibonacci.js";

parentPort.on("message", (msg) => {
  const fibonacci = new Fibonacci(msg.number);

  fibonacci.on("end", (data) => {
    parentPort.postMessage({ event: "end", data: data });
  });

  fibonacci.init();
});
