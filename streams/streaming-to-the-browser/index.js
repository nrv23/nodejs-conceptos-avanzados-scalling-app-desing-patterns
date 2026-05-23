import { createServer } from 'node:http';
import { createReadStream, stat } from 'node:fs';
import { promisify } from 'node:util';

const fileName = './the-universe.mp4';
const fileInfo = promisify(stat); // promisify convierte metodos de callback return a promise return
createServer(async (req, res) => {
    // recordar que Response es un tipo de stream writable
    // express y nodejs se basan en streams y en event emitter
    const { size } = await fileInfo(fileName);
    const range = req.headers.range; // intervalo entre un punto de inicio y un punto final de bytes del stream
    console.log({ range });
    console.log("range request...")
    res.writeHead(200, { "Content-Type": "video/mp4", "Content-Length": size }); // setear el tipo de contenido de respesta
    createReadStream(fileName)
        .pipe(res)
        .on("error", console.error);

}).listen(3000, () => console.log("Escuchado solicitudes en puerto 3000"));