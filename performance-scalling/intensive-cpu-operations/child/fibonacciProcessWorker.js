import { Fibonacci } from "../fibonacci.js";

process.on("message", (msg) => {
  const fibonacci = new Fibonacci(msg.number);

  fibonacci.on("end", (data) => {
    process.send({ event: "end", data: data });
  });

  fibonacci.init();
});

process.send("ready");
