const { connect } = require("node:net");
const { Readable } = require("node:stream");


function createNumberStream() {
    let number = 0;
    return new Readable({
        objectMode: true, // no envia strings ni buffer binarios
        read() {
            if (number < 10) {
                this.push(number);
                number++;
            } else {
                this.push(null); // el metodo se ejecuta hasta que yo envue null
            }
        }
    })
}

function createStringStream() {

    const strings = ["hello", "this", "is", "a", "nodejs", "advanced", "concepts", "course", "XD"];

    let index = 0;

    return new Readable({
        objectMode: true,
        read() {

            if (index < strings.length) {
                this.push(strings[index]); // el metodo se ejecuta hasta que yo envue null
                index++;
            } else {
                this.push(null);
            }
        }
    })
}

function createMultiplexingStream(streams = [], dest) {

    if (streams.length === 0) throw new Error('Streams array is Empty');

    let activeStreams = streams.length;

    streams.forEach((stream, index) => {
        stream.on('data', chunk => {
            const dataBuffer = Buffer.from(chunk.toString()); // convertir a buffer
            // 1 byte = 8 bits
            const header = Buffer.alloc(5); // reservar tamano en bytes para cada chunk
            // metadatos de encabezado
            header.writeUint8(index, 0); // alloc se reserva solo para el header
            // tamano del chunk, el valor del chunk tiene su propia memoria
            header.writeUint32BE(dataBuffer.length, 1); // esto usa su propia memoria
            /*

                El alloc reserva espacio para la cabecera.
                Dentro de la cabecera se almacena:
                - el canal
                - el tamaño del chunk
                El contenido del chunk se almacena en otro buffer.

            */

            dest.write(Buffer.concat([header, dataBuffer]));

            console.log(`Sent data on channel ${index}: ${chunk}`)
        });

        stream.on('end', _ => {
            activeStreams--;

            if (activeStreams === 0) {
                dest.end();

                console.log('All streams ended');
            }
        })
    });
}

const socket = connect(5000, 'localhost', () => {
    console.log("Server is running");

    const numbersStream = createNumberStream();
    const stringStream = createStringStream();

    createMultiplexingStream([numbersStream, stringStream], socket)
});

socket.on('error', err => console.log("Error is socket ", err));