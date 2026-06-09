
import { Readable, Writable } from "node:stream";
import { PassThrough } from 'stream';

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
function createMultiplexingStream(streams = [], channel) {
    if (streams.length === 0) throw new Error('Streams array is Empty');

    let activeStreams = streams.length;

    let paused = false;

    channel.on('drain', () => { // el drain debe estar a fuera de la lectura de datos porque es un estado global de todo el stream, no es por chunk
        paused = false;

        for (const stream of streams) {
            stream.resume();
        }
    });

    streams.forEach((stream, index) => {
        stream.on('data', chunk => {
            const header = Buffer.alloc(5);
            const dataBuffer = Buffer.from(String(chunk));

            header.writeUInt8(index, 0);
            header.writeUInt32BE(dataBuffer.length, 1);

            const ok = channel.write(Buffer.concat([header, dataBuffer]));

            if (!ok) {
                paused = true;
                stream.pause(); // solo pausas el que está emitiendo
            }
        });

        stream.on('end', () => {
            activeStreams--;
            if (activeStreams === 0) channel.end();
        });
    });
}
function createDemultiplexer(channel, writableDest) {

    channel.on('readable', () => {

        let chunk;

        while ((chunk = channel.read()) !== null) {

            const channelId = chunk.readUInt8(0);// obtiene el channel
            const payloadLength = chunk.readUInt32BE(1); // obtiene el payloadLength
            const payload = chunk.subarray(5, 5 + payloadLength).toString(); // obtener desde una posicion en bytes

            const canWrite = writableDest.write({
                channel: channelId,
                payload
            });

            if (!canWrite) {
                channel.pause();
            } else {
                console.log(`Demultiplexing data ${channelId}:`, payload);
            }
        }
    });
    // el drain debe estar a fuera de la lectura de datos porque es un estado global de todo el stream, no es por chunk
    writableDest.on('drain', () => {

        console.log('resume readable stream');
        channel.resume();
    });
}

function createWritableStreamConsumer() {
    return new Writable({
        objectMode: true,
        write(chunk, enc, cb) {
            // aplica aqui el demultiplexing
            console.log(` data : ${chunk.channel}, payload: ${chunk.payload}`);
            cb();
        }
    })
}


const numbersStream = createNumberStream();
const stringStream = createStringStream();
const sharedStream = new PassThrough({
    objectMode: true,
    highWaterMark: 16 * 1024
});
const consumer = createWritableStreamConsumer();


createDemultiplexer(
    sharedStream,
    consumer
);

createMultiplexingStream(
    [numbersStream, stringStream],
    sharedStream
);