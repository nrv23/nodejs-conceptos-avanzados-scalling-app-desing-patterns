// http-server sirve para levantar un servidor local para correr codigo en frontend


const URL = 'http://localhost:5000';


async function consumeWebStreamsAPI(signal) {
    const response = await fetch(URL, { signal });

    const readerObj = response.body
        .pipeThrough(new TextDecoderStream())
        .pipeTo(
            new WritableStream({
                write(chunk) {
                    console.log("Reading   ", chunk);
                }
            })
        );

    return readerObj;
}

const abortController = new AbortController();

(async () => { // funcion anonima autollamada
    console.log("Ejecuc")
    await consumeWebStreamsAPI(abortController.signal);
})();