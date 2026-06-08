import { createReadStream, createWriteStream } from "node:fs";
import split from 'split';
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url); // ruta del archivo
const __dirname = path.dirname(__filename); // con esa ruta del archivo actual, obtiene la ruta de la carpeta actual

const dest = 'merged.csv';
const sources = [path.join(__dirname, './file1.csv'), path.join(__dirname, './file2.csv')];

const destSteam = createWriteStream(dest);
let headerWritten = false;
let endCount = 0;

for (const source of sources) {
    const sourceStream = createReadStream(source, {
        encoding: 'utf8',
        highWaterMark: 16 * 1024 // 16 KB tamaño maximo de chunk
    });

    let isFirstLine = true;

    sourceStream.on("end", chunk => {
        if (++endCount === sources.length) {
            // hasta que todos los source streams que son readable streams se finalicen, el writable stream se cierra.
            destSteam.end(); // termina el proceso de escritura de streams
            console.log(dest + " created");
        }
    });

    // escribir streams

    sourceStream.pipe(split(line => {
        if (isFirstLine) { // en el primer chunk para copiar los titulos
            isFirstLine = false; //
            if (!headerWritten) {
                headerWritten = true;
                return line + '\n';
            }

            return;
        }

        return line + '\n';
    })).pipe(destSteam, {
        end: false // evita que el pipe cierre el writable strea, buffer automaticmente
    });
}


