import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url); // ruta del archivo
const __dirname = path.dirname(__filename); // con esa ruta del archivo actual, obtiene la ruta de la carpeta actual


//console.log("Allocate new process", process.pid);


process.on("message", async filePath => {

    try {

        const fullPath = path.join(__dirname, 'db', filePath);

        await pipeline(
            createReadStream(fullPath), // un Readable stream es un AsyncIterator.
            async function* (source) { // source es el buffer de lectura por cada archivo que lee
                for await (const chunk of source) { // por eso se usa un await al leer el bufffer
                    if (!chunk.length) continue;
                    const record = JSON.parse(chunk.toString().split('\n')[0]);
                    if (record.email.includes('hotmail')) {
                        process.send({
                            status: "ok",
                            message: record,
                            fullPathProcess: fullPath
                        })
                    }

                    continue;
                }
            }
        )

    } catch (error) {
        console.log({ error })
        process.send({
            status: 'error',
            message: error.message
        })
    }

    /**/

});
