import { createServer } from 'node:http';
import { createReadStream, createWriteStream, stat } from 'node:fs';
import { promisify } from 'node:util';

import Multiparty from 'multiparty';

const fileName = './the-universe.mp4';

const respondeWithVideoStream = async (req, res) => {
    // recordar que Response es un tipo de stream writable
    // express y nodejs se basan en streams y en event emitter
    const { size } = await fileInfo(fileName); // tamño en bytes

    // range request 

    const range = req.headers.range; // intervalo entre un punto de inicio y un punto final de bytes del stream
    // range devuelve algo como esto 'bytes=0-'
    // si el endbyte no viene entonces se toma el tamaño total del archivo menos 1
    console.log("range request...")
    if (range) {
        const [start, end] = range.replace(/bytes=/, '').split('-');// intervalo en bytes

        const startByte = parseInt(start, 10);
        const endByte = end ? parseInt(end, 10) : size - 1;
        // devuelve la parte del range que se solicito 

        res.writeHead(206, { // codigo para devolver respuesta de partial file
            'Content-Range': `bytes ${startByte}-${endByte}/${size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': (endByte - startByte) + 1,
            "Content-Type": "video/mp4"
        });

        createReadStream(fileName, {
            start: startByte,
            end: endByte
        })
            .pipe(res)
            .on("error", console.error);

    } else {
        res.writeHead(200, { "Content-Type": "video/mp4", "Content-Length": size }); // setear el tipo de contenido de respesta
        createReadStream(fileName)
            .pipe(res)
            .on("error", console.error);
    }

};
const fileInfo = promisify(stat); // promisify convierte metodos de callback return a promise return
createServer((req, res) => {

    if (req.method === "POST") {
        // req es un readable stream
        // res es un writable stream
        /*req.on("data", data => {
            console.log("subiendo datos... ", data);
        })
        req.pipe(res); // el archivo que sube es el que responde
        req.pipe(createWriteStream('./test.file')); // crear el archivo a partir de los datos streams subidos
        */

        const form = new Multiparty.Form();
        form.on("part", part => {
            console.log("subiendo datos... ", part);
            part
                .pipe(createWriteStream(`./${part.filename}`))
        })
            .on("close", () => {
                res.writeHead(200, {
                    "Content-Type": "text/html"
                });
                res.end(`<h1>File uploaded!</h1>`);
            });
        form.parse(req);

    }
    else if (req.url === "/video") {
        respondeWithVideoStream(req, res);
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });

        res.end(`

            <form enctype="multipart/form-data" method="POST" action="/">
                <input type="file" name="upload-file" />
                <button type="submit">
                    upload
                </button>
            </form>

        `);
    }
})
    .listen(3000, () => console.log("Escuchado solicitudes en puerto 3000"));