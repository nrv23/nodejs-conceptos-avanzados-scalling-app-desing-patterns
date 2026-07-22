import { createServer } from "http";
import { Fibonacci } from "./fibonacci.js";

const DEFAULT_NUMBER = 40;

createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (url.pathname !== "/fib") {
    res.writeHead(200);
    return res.end("Up! \n");
  }

  const num = parseInt(url.searchParams.get("number")) || DEFAULT_NUMBER;
  res.writeHead(200);

  const fibonacci = new Fibonacci(num);
  fibonacci.on("end", (data) => {
    res.write(`Fibonacci for n = ${num}: ${JSON.stringify(data)}`);
    res.end();
  });

  fibonacci.init();
}).listen(5000, () => console.log("Server started on port 5000"));
