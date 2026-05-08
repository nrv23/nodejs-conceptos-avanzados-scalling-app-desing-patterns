import { CancelError } from "../cancelError.js";
import { createCancelableTask } from "./createAsyncCancelable.js";

import { someAsyncFunction } from "../someAsyncTask.js";

const cancelable = createCancelableTask(function* () {
    const result1 = yield someAsyncFunction("1");
    console.log(result1);

    const result2 = yield someAsyncFunction("2");
    console.log(result2);

    const result3 = yield someAsyncFunction("3");
    console.log(result3);
});

const { promise, cancel } = cancelable();


promise.catch((err) => {
    if (err instanceof CancelError) {
        console.log(err.message);
    } else {
        console.error(err);
    }
});

setTimeout(() => {
    cancel();
}, 100);
