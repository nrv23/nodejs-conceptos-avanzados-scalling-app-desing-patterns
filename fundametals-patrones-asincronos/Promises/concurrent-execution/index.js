import PromiseQueue from "./PromiseQueue.js";


const wait = sec => {
    return new Promise((resolve, _) => {
        setTimeout(() => resolve(true), sec);
    });
}

const tasks = [
   () =>  wait(1000),
   () =>  wait(1000),
   () =>  wait(1000),
   () =>  wait(1000),
   () =>  wait(1000),
   () =>  wait(1000),
   () =>  wait(1000),
   () =>  wait(1000),
   () =>  wait(1000),
   () =>  wait(1000),
];

var taskQueue = new PromiseQueue(tasks, 2);
taskQueue.run();