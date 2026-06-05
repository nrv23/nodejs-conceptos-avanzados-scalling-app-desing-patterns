import { createReadStream, createWriteStream } from "node:fs";
import { createCombinedStream } from "./combineStream.js";
import { pipeline } from "node:stream";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url); // ruta del archivo
const __dirname = path.dirname(__filename); // con esa ruta del archivo actual, obtiene la ruta de la carpeta actual
const filePath = path.join(__dirname, 'data.csv'); // genera la ruta del archivo csv


pipeline(
    createReadStream(filePath),
    createCombinedStream({
        minAge: 30
    }),
    createWriteStream('./result.txt'),
    (err) => {
        if (err) {
            console.error('Error in pipeling streams', err)
            process.exit(1);
        } else {
            console.log("Stream end")
        }
    }
)