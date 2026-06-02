import { Transform, Readable } from "node:stream";


let counter = 0;

const transform = new Transform({
    objectMode: true,

    transform(chunk, enc, cb) {

        setTimeout(() => {
            counter++;
            console.log(counter);
            cb(null, chunk);
        }, 1000);
    }
});


Readable.from(["A", "B,", "C"])
    .pipe(transform)
    .on('data', console.log)
