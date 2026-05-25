import { pipeline } from 'node:stream/promises';
import { setTimeout } from 'node:timers/promises';

async function* myReadable() { // actua como stream readable, funciones de tipo generador

    yield Buffer.from("I am");
    await setTimeout(150);
    yield Buffer.from("Nataniel");
}

async function* myTransform(stream) { // este funcion como un stream de tipo transform
    for await (const chunk of stream) {
        yield chunk.toString().toUpperCase();
    }
}

async function* myWritable(stream) {
    for await (const chunk of stream) {
        console.log("Incoming chunk...", chunk)
    }
}


async function* myDuplex(stream) {
    let bytes = 0, message = [];
    for await (const chunk of stream) {
        console.log("Duplex: ", chunk);
        bytes += chunk.length;
        message.push(chunk);
    }

    yield message.join();
    yield bytes;
}

// node 19+
await pipeline(myReadable, myTransform, myDuplex, myWritable); // el pipeline permite ejecutar streams y el primero debe ser el readable