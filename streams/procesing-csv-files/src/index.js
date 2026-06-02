import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WritableStream, TransformStream } from 'node:stream/web';
import { Readable, Transform } from 'node:stream';
import csvtojson from 'csvtojson';
import { setTimeout } from 'node:timers';


const __filename = fileURLToPath(import.meta.url); // ruta del archivo
const __dirname = path.dirname(__filename); // con esa ruta del archivo actual, obtiene la ruta de la carpeta actual
const filePath = path.join(__dirname, 'imd_movies.csv'); // genera la ruta del archivo csv


const PORT = process.env.PORT || 5000;

const allowedHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

function createSkipTransform(offset) {

    let currentRow = 0;

    return new TransformStream({

        transform(chunk, controller) {

            console.log({ chunk });

            currentRow++;

            if (currentRow <= offset) {
                return; // ignora hasta que se posicione en offset 
            }

            controller.enqueue(chunk);
        }
    });
}

function createAbortController(req) {
    const controller = new AbortController();
    req.once("close", _ => {
        console.log("Cliente disconnected...");
        controller.abort();
    });


    return controller;
}

function createWritableWebStream(res) {
    return new WritableStream({
        write(chunk) {
            res.write(chunk); // res es un objeto de tipo writable stream
        },
        close() {
            res.end();
        }
    })
}

function createTransformStream() {
    return new TransformStream({
        transform(chunk, controller) { // el chunk viene como objeto JSON
            // el chunk viene como un buffer
            const { poster_path, original_title, original_language, revenue } = JSON.parse(Buffer.from(chunk));
            const newChunk = JSON.stringify({ // nuevo chunk
                poster_path: poster_path.toUpperCase(),
                original_title: original_title.toUpperCase(),
                original_language,
                revenue
            });
            controller.enqueue(newChunk.concat("\n"));
        }
    })
}

async function handleRequest(req, res) {

    res.writeHead(200, allowedHeaders);

    if (req.method === "OPTIONS") {
        res.writeHead(204, allowedHeaders);
        res.end();
    }

    const abortCOntroller = createAbortController(req);

    try {

        const url = new URL(req.url, `http://${req.headers.host}`);
        const offset = Number(url.searchParams.get('offset') ?? 0);

        console.log({ offset });

        await Readable.toWeb(createReadStream(filePath, {
            encoding: 'utf-8'
        }))

            .pipeThrough(Transform.toWeb(csvtojson())) // csvtojson no es un webstream, se usa Transform.toWeb para convertir csvtojson a webStream 
            .pipeThrough(createSkipTransform(offset))
            .pipeThrough(createTransformStream())
            .pipeTo(createWritableWebStream(res), {
                signal: abortCOntroller.signal
            }) // leer el archivo y responder el endpoint usando writable streams
    } catch (err) {
        console.log({ err })
        if (err.name === 'AbortError') {
            console.log("Stream ended ");
        } else {
            console.log("Error was ocurred");
            res.statusCode = 500;
            res.end("Internal server error");
        }
    }
};

createServer(handleRequest)
    .listen(PORT, () => {
        console.log("Servidor peticiones en puerto " + PORT);
    });

