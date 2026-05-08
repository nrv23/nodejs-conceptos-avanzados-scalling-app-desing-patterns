import { CancelError } from "./cancelError.js";
import { createCancelable } from "./createCancalable.js";
import { someAsyncFunction } from "./someAsyncTask.js";

async function cancalableFunction(cancelWrapper) {
  const result1 = await cancelWrapper(someAsyncFunction, "1");
  console.log(result1);

  const result2 = await cancelWrapper(someAsyncFunction, "2");
  console.log(result2);

  const result3 = await cancelWrapper(someAsyncFunction, "3");
  console.log(result3);
}

const { cancelWrapper, cancel } = createCancelable();

cancalableFunction(cancelWrapper).catch((err) => {
  if (err instanceof CancelError) {
    console.log("Function was canceled.");
  } else {
    console.error(err);
  }
});

setTimeout(() => {
  cancel();
}, 100);
