
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { setInterval } from 'node:timers/promises';

const controller = new AbortController();

controller.signal.onabort = e => {
    console.log({ e });
    console.log("Process was aborted");
}

async function* myReadable() { //  ac parametro de objeto de configuracion de pipeline method
    for await (const interval of setInterval(300)) {
        // if (ac.signal.aborted) break;
        yield Buffer.from("!");
    }
}


async function* myWritable(stream) {

    for await (const chunk of stream) {
        console.log("incoming chunk: ", chunk.toString());
    }
}

setTimeout(() => {
    console.log("Se detuvo el proceso de lectrua y escritura de streams....")
    controller.abort(); // al abortar con abortController la ejecucion del stream se detiene
}, 1000);

await pipeline(Readable.from(myReadable()), myWritable, {
    signal: controller.signal // usa el abortController para detener la ejecucion del pipeline de stream
    // el parametro signal que esta en este objeto 
    // va como argumento en la funcion generador readable stream
})
    .catch(err => console.log({ err }));

// otra forma
/*
await pipeline(myReadable, myWritable, {
    signal: controller.signal // usa el abortController para detener la ejecucion del pipeline de stream
    // el parametro signal que esta en este objeto 
    // va como argumento en la funcion generador readable stream
});*/