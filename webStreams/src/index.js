import { ReadableStream, WritableStream } from 'node:stream/web';
import { setTimeout } from 'node:timers/promises';


const readable = new ReadableStream({
    async start(controller) { // controller es quien encola los mensajes al readable stream
        let counter = 0;
        for (const _ of setTimeout(300)) {
            controller.enqueue(`Message ${counter}`);
            counter++;
        }
    }
})