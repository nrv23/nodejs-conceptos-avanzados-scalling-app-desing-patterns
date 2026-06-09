
import { Readable, Writable } from "node:stream";


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

function createMultiplexingStream(streams = [], writableDest) { // writableDest writableSTream que es el consumidor 

    if (streams.length === 0) throw new Error('Streams array is Empty');

    let activeStreams = streams.length;

    streams.forEach((stream, index) => {
        stream.on('data', chunk => {

            const data = {
                channel: index,
                payload: chunk
            }

            writableDest.write(data); // escribe aqui en el consumer        
            console.log(`Sent data on channel ${index}:`, data);
        });

        stream.on('end', _ => {
            activeStreams--;

            if (activeStreams === 0) {

                writableDest.end();
                console.log('All streams ended');
            }
        })
    });
}


function createWritableStreamConsumer() {
    return new Writable({
        objectMode: true,
        write(chunk, enc, cb) {
            // aplica aqui el demultiplexing
            console.log(`Demultiplexing data : ${chunk.channel}, payload: ${chunk.payload}`);
            cb();
        }
    })
}


const numbersStream = createNumberStream();
const stringStream = createStringStream();
const consumer = createWritableStreamConsumer()
createMultiplexingStream([numbersStream, stringStream], consumer)