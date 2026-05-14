import PromiseQueue from "./PromiseQueue.js";


const wait = sec => {
    return new Promise((resolve, _) => {
        setTimeout(resolve(true), sec);
    });
}

const tasks = [
    wait(7),
    wait(7),
    wait(7),
    wait(7),
    wait(7),
    wait(7),
    wait(7),
    wait(7),
    wait(7),
    wait(7),
];

var taskQueue = new PromiseQueue(tasks, 3);
taskQueue.run();