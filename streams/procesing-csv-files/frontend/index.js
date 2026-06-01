// http-server sirve para levantar un servidor local para correr codigo en frontend

const URL = 'http://localhost:5000';
let abortController = new AbortController();

const start = document.getElementById('start');
const stopbtn = document.getElementById('stop');
const cards = document.getElementById('cards');

function parseChnunk() {
    let buffer = "";
    return new TransformStream({
        transform(chunk, controller) {
            buffer += chunk;
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {

                try {
                    controller.enqueue(JSON.parse(line));
                } catch (error) {
                    console.error("Failed to parse JSON data", error, line);
                }
            }
        },

        flush(controller) {

            try {
                controller.enqueue(JSON.parse(buffer));
            } catch (error) {
                console.error("Failed to parse JSON data during flush", error, buffer);
            }
        }
    })
}

async function consumeWebStreamsAPI(signal) {
    const response = await fetch(URL, { signal });

    const readerObj = response.body
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(parseChnunk())

    return readerObj;
}

function displayData(element) {
    return new WritableStream({
        write({ poster_path, original_title, revenue }) {

            const article = `
            <article>
                <div class="text">
                    <h2>${original_title}</h2>
                    <h3>${revenue}</h3>
                    <a href="${poster_path}">View Poster</a>
                </div>
            </article>
            `;

            element.innerHTML += article;
        }
    });

}



/*

    .pipeTo(
            new WritableStream({
                write(chunk) {
                    console.log("Reading   ", chunk);
                }
            })
        );


        new WritableStream({
            write(chunk) {
                console.log("Reading   ", chunk);
            }
        })

*/

start.addEventListener('click', async e => {

    //e.preventDefault();
    console.log("Ejecuc")
    const readableStream = await consumeWebStreamsAPI(abortController.signal);
    readableStream.pipeTo(displayData(cards));
});

stopbtn.addEventListener('click', e => {
    abortController.abort();
    abortController = new AbortController();
});