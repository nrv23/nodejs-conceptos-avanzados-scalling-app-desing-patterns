import { CancelError } from "./cancelError.js";
import { someAsyncFunction } from "./someAsyncTask.js";

function throwIfCancelled(cancel) {
  if (cancel.reqCanceled) {
    throw new CancelError();
  }
}

async function cancalableFunction(cancel) {
  const result1 = await someAsyncFunction("1");
  console.log(result1);
  throwIfCancelled(cancel);

  const result2 = await someAsyncFunction("2");
  console.log(result2);
  throwIfCancelled(cancel);

  const result3 = await someAsyncFunction("3");
  console.log(result3);
}

const cancel = { reqCanceled: false };

cancalableFunction(cancel).catch((err) => {
  if (err instanceof CancelError) {
    console.log("Function was canceled.");
  } else {
    console.error(err);
  }
});

setTimeout(() => {
  cancel.reqCanceled = true;
}, 100);
