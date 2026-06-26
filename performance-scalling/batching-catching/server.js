import { createServer } from "http";
import { calculateFactorial } from "./catchingFactorial.js";
//import { calculateFactorial } from "./factorial.js";
//import { calculateFactorial } from "./batchingFactorial.js";

createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const numParam = url.searchParams.get("number");
  console.log(`Calculating factorial of : ${url.search}`);

  let num = parseInt(numParam, 10);
  if (isNaN(num) || num < 1) {
    num = 10; // default to 10 if invalid or missing
  }

  const result = await calculateFactorial(num);

  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);
  res.end(JSON.stringify({ number: num, factorial: result }));
}).listen(5000, () => console.log("Server started on port 5000"));
