import fs from 'fs';
import { PassThrough } from 'stream';
import TransformStream from './Transform.js';
import Throttle from './Throttle.js';

const readStream = fs.createReadStream('./texto.txt', {
    encoding: "utf-8"
});
const writableStream = fs.createWriteStream('texto-editado.txt', {
    highWaterMark: 16 * 1024
});
const report = new PassThrough();
const throttle = new Throttle(20);
const transformStream = new TransformStream();

report.on("data", chunk => {
    console.log("Leyendo chunk ....");
    console.log(chunk);
});

readStream.pipe(throttle)
    .pipe(report)
    .pipe(transformStream)
    //.pipe(process.stdout) // muestra en consola
    .pipe(writableStream);


writableStream.on("finish", () => console.log("Stream finalizado"));