import { calculateFactorial as getFactorialResult } from "./factorial.js";

const pendingRequests = new Map(); // guardar el valor del factorial para poder cachearlo

export function calculateFactorial(num) {
    const isExecutedRequest = pendingRequests.has(num);
    console.log({ isExecutedRequest })
    if (isExecutedRequest) {
        console.log("Batching request...");
        return pendingRequests.get(num);
    }

    const newFactorialPromise = getFactorialResult(num);
    pendingRequests.set(num, newFactorialPromise);
    /*
    newFactorialPromise.finally(() => {
        pendingRequests.delete(num);
    })*/

    return newFactorialPromise;
}