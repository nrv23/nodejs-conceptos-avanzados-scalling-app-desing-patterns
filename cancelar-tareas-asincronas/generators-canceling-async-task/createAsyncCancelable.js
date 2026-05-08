import { CancelError } from "../cancelError.js";

export function createCancelableTask(generatorFn) {

    return function asyncCancelableTask(...args) {
        const generator = generatorFn(...args);
        let reqCanceled = false;

        function cancel() {
            reqCanceled = true;
        }

        const promise = new Promise((resolve, reject) => {

            async function nextYield(prevGenerator) {
                if (reqCanceled) return reject(new CancelError());

                try {
                    if (!prevGenerator.done) {
                        return nextYield(generator.next(await prevGenerator.value));
                    }

                    return resolve(prevGenerator.value);

                } catch (error) {
                    try {
                        await generator.throw(error);
                    } catch (error2) {
                        if (error2 instanceof CancelError)
                            reject(error2);
                        else
                            reject(error);
                    }
                }
            }


            nextYield(generator);
        });


        return { promise, cancel };

    }
}