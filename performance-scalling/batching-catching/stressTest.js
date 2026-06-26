import superagent from "superagent";

const start = Date.now();
let count = 30; // Now we send 30 requests
let pending = count;
const interval = 170; // 170 ms interval
const query = "number=10";

function sendRequest() {
  superagent
    .get(`http://localhost:5000?${query}`)
    .then((result) => {
      console.log(result.status, result.body);
      if (!--pending) {
        console.log(`All completed in: ${Date.now() - start}ms`);
      }
    })
    .catch((err) => console.error(err));

  if (--count) {
    setTimeout(sendRequest, interval);
  }
}

sendRequest();
