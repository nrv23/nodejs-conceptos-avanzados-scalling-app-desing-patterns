import { readdir } from "node:fs/promises";
import { fork } from 'node:child_process';
import { createWriteStream, read } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PassThrough, Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const __filename = fileURLToPath(import.meta.url); // ruta del archivo
const __dirname = path.dirname(__filename); // con esa ruta del archivo actual, obtiene la ruta de la carpeta actual


const files = await readdir(path.join(__dirname, 'db'));
const outputPath = path.join(__dirname, 'db', 'output-hotmal.json');
const output = createWriteStream(outputPath);
const backgroundTaskPath = path.join(__dirname, './backgroundTask.js');
const processesStream = [];

function mergeStreams(streams) {
    if (!Array.isArray(streams) || streams.length === 0) {
        throw new Error("streams must be array and must be not empty");
    }

    const passThroughStream = new PassThrough();
    let pendingStreamsToRead = streams.length;

    for (const stream of streams) {
        // el stream.pip escribe el bufffer sobre el mismo passThroughStream, por cada iteracion va chunk a chunk
        stream.pipe(passThroughStream, { end: false });

        stream.once("end", () => {
            pendingStreamsToRead--;

            if (pendingStreamsToRead === 0) {
                passThroughStream.end(); // si ya todos los streams se cargaron en el passthrought entonces se cierra el buffer de lectura

            }
        });

        stream.once("error", error => {
            passThroughStream.destroy(error);
        });
    }

    return passThroughStream;
}

function childProcessToStream(cp, file) {

    const stream = Readable({

        read() {

        }
    });

    cp.on("message", ({ status, message, fullPathProcess }) => {

        if (status === 'error') {
            console.log({
                msg: "An error has ocurred",
                message,
                pid: cp.pid,
                file: fullPathProcess
            });

            // terminar lectura de stream si ocurre un error 

            stream.push(null); // esto detiene la lectura de datos
            return; // detiene la ejecucion
        }

        if (fullPathProcess) stream.push(JSON.stringify({ pid: cp.pid, file: fullPathProcess, message, status }).concat('\n'));
    });

    cp.send(file);

    return stream;
}

for (const file of files) {

    const cp = fork(backgroundTaskPath,
        [] // si quiero enviar variables de entorno 
        , {
            silent: false // poder los logs del proceso
        });

    const stream = childProcessToStream(cp, file);
    processesStream.push(stream);
}

const streams = mergeStreams(processesStream)

await pipeline(streams, async function* (source) {
    for await (const chunk of source) { // por eso se usa un await al leer el bufffer

        const { file, message, status, pid } = JSON.parse(chunk.toString().split('\n')[0]);

        yield JSON.stringify({ file, ...message, status, pid }).concat('\n');
    }
}, output);