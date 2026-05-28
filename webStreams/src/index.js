import { ReadableStream, WritableStream, TransformStream } from 'node:stream/web';
import { setInterval, setTimeout } from 'node:timers/promises'
import { Readable } from 'node:stream';



async function* myReadable() {
    let counter = 0;
    for await (const _ of setInterval(300)) {
        counter++;
        yield counter;
    }
}

// convertir un stream, a web stream
const readable = Readable.toWeb(Readable.from(myReadable()));

/*
const readable = new ReadableStream({
    async start(controller) { // controller es quien encola los mensajes al readable stream
        let counter = 0;
        for await (const _ of setInterval(300)) {
            controller.enqueue(`Message ${counter}`);
            counter++;
        }
    }
});

*/
const transform = new TransformStream({ //  es una funcion que transforma un stream en otro
    transform(chunk, controller) {
        console.log("Transforming --->", chunk);
        controller.enqueue(chunk.toString().toUpperCase());
    }
});

const writable = new WritableStream({
    write(chunk) {
        console.log("Writable... ", chunk);
    }
})

// pipeline -->  pipeThrough --> pipeTo

readable.pipeThrough(transform).pipeTo(writable);