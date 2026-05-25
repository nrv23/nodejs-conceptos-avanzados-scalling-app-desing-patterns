
import net from 'node:net';
import { Writable } from 'node:stream';

function log(msg) {
    process.stdout.write(`\r ${msg}`);
}

const myWritable = Writable({
    write(chunk, enc, cb) {

        const { connectionId, message = null } = JSON.parse(chunk); // respuesta del socket server

        if (connectionId || message) {
            // si el mensaje no viene entonces no se imprime
            message && connectionId && log(`${connectionId} says: ${message}`);

            log(`My ID: ${connectionId}`);
            log("")

            log("type something...")

            cb(null, chunk);

        } else {
            cb(new Error("NO data received"), null);
        }

    }
})

process.stdin.pipe(net.connect(3000)).pipe(myWritable); // lo que escribo en consola se envia por el socket al servidor y el servidor recibe 
// y devuelve lo que le voy enviando