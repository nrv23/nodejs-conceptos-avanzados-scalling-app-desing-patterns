import { calculateFactorial as getFactorialResult } from "./factorial.js";

const CACHE_LIFE_TIME = 20 * 1000; // despues de 20 segundos
const cache = new Map(); // guardar el valor del factorial para poder cachearlo

export function calculateFactorial(num) {
    const isExecutedRequest = cache.has(num);
    console.log({ isExecutedRequest })
    if (isExecutedRequest) {
        console.log("getting from cache...");
        return cache.get(num);
    }

    const newFactorialPromise = getFactorialResult(num);
    console.log('Setting new value in the cache....');
    cache.set(num, newFactorialPromise);
    newFactorialPromise.then(() => {
        //eliminar informacion del cache

        setTimeout(() => {
            cache.delete(num);
        }, CACHE_LIFE_TIME)
    }).catch(err => {
        cache.delete(num);
        throw err;
    })

    return newFactorialPromise;
}