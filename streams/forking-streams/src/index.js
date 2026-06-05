import { createReadStream, createWriteStream } from 'node:fs';
import { Transform } from 'node:stream';

import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url); // ruta del archivo
const __dirname = path.dirname(__filename); // con esa ruta del archivo actual, obtiene la ruta de la carpeta actual
const filePath = path.join(__dirname, 'test.txt'); // genera la ruta del archivo csv


const upperCaseTransform = new Transform({

    transform(chunk, enc, cb) {
        console.log(chunk.toString());
        this.push(chunk.toString().toUpperCase());
        cb();
    }
});


const reverseTransform = new Transform({

    transform(chunk, enc, cb) {
        this.push(chunk.toString().reverse());
        cb();
    }
});


const inputStream = createReadStream(filePath);


// forking streams 

inputStream.pipe(upperCaseTransform).pipe(createWriteStream('./upperStreamResult.txt'));
inputStream.pipe(reverseTransform).pipe(createWriteStream('./reverseStreamResult.txt'));


inputStream.on('data', data => {
    console.log('reading chunk ....', data);
});

inputStream.on('end', () => console.log('Stream ended'));