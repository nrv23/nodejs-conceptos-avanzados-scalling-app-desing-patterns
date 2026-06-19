import { readdir } from "node:fs/promises";
import { fork } from 'node:child_process';
import { createWriteStream, read } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const __filename = fileURLToPath(import.meta.url); // ruta del archivo
const __dirname = path.dirname(__filename); // con esa ruta del archivo actual, obtiene la ruta de la carpeta actual


const files = await readdir(path.join(__dirname, 'db'));
const outputPath = path.join(__dirname, 'db', 'output-hotmal.json');
const output = createWriteStream(outputPath);
const backgroundTaskPath = path.join(__dirname, './backgroundTask.js');
const processesStream = [];

function childProcessToStream(cp, file) {

    const stream = Readable({

        read() {

        }
    });

    cp.on("message", fullPath => {
        stream.push(JSON.stringify({ pid: cp.pid, file: fullPath }));
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

await pipeline(processesStream[0], async function* (source) {
    for await (const chunk of source) { // por eso se usa un await al leer el bufffer
        console.log(chunk.toString())
    }
})