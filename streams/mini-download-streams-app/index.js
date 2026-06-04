import { createServer } from 'node:http';
import { createReadStream, stat } from 'node:fs';
import { promisify } from 'node:util';

const fileName = './the-universe.mp4';
const fileInfo = promisify(stat); // promisify convierte metodos de callback return a promise return
createServer(async (req, res) => {
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
            end: endByte
        })
        streams.pipe(res)
        streams.on("error", console.error);



    } else {

        res.writeHead(200, { "Content-Type": "video/mp4", "Content-Length": size }); // setear el tipo de contenido de respesta
        streams = createReadStream(fileName)
        streams.pipe(res)
        streams.on("error", console.error);
    }

    res.on("close", () => {
        if (!streams.destroyed) {
            console.log("Cliente desconectado");
            streams.destroy(); // se destruye el stream si se cierra la conexion
        }
    });


}).listen(3000, () => console.log("Escuchado solicitudes en puerto 3000"));