import { createServer } from 'node:http';
import { createReadStream, stat } from 'node:fs';
import { promisify } from 'node:util';

const fileName = './Clase01.mp4';
const allowedHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Range",
    "Access-Control-Expose-Headers": "Content-Range, Content-Length, Accept-Ranges"
};

const fileInfo = promisify(stat); // promisify convierte metodos de callback return a promise return
createServer(async (req, res) => {

    // setear cabeceras para cors
    for (const [key, value] of Object.entries(allowedHeaders)) {
        res.setHeader(key, value);
    }

    if (req.method === "OPTIONS") {
        res.writeHead(204, allowedHeaders);
        res.end();
    }


    console.log("Entro a solicitud")

    // recordar que Response es un tipo de stream writable
    // express y nodejs se basan en streams y en event emitter
    const { size } = await fileInfo(fileName); // tamño en bytes

    // range request 

    const range = req.headers.range; // intervalo entre un punto de inicio y un punto final de bytes del stream
    // range devuelve algo como esto 'bytes=0-'
    // si el endbyte no viene entonces se toma el tamaño total del archivo menos 1
    let streams;
    console.log("range request...")
    if (range) {

        console.log({
            range,
            size
        });
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

        streams = createReadStream(fileName, {
            start: startByte,
            end: endByte,
            highWaterMark: 16 * 1024 // 16 KB tamaño maximo de chunk
        })
        streams.pipe(res)
        streams.on("error", console.error);



    } else {

        res.writeHead(200, { "Content-Type": "video/mp4", "Content-Length": size }); // setear el tipo de contenido de respesta
        streams = createReadStream(fileName, {
            highWaterMark: 16 * 1024 // 16 KB tamaño maximo de chunk
        })
        streams.pipe(res)
        streams.on("error", console.error);
    }

    res.on("close", () => {
        if (!streams.destroyed) {
            console.log("Cliente desconectado");
            streams.destroy(); // se destruye el stream si se cierra la conexion
        }
    });


    streams.on('data', chunk => {

        const canContinue = res.write(chunk);

        if (!canContinue) {

            streams.pause();

            res.on('drain', () => {
                streams.resume();
            });
        }
    });


}).listen(3000, () => console.log("Escuchado solicitudes en puerto 3000"));