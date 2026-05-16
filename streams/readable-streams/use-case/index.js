import fs from 'fs';


// leer un video usando streams
const readStream = fs.createReadStream('./../the-universe.mp4');

readStream.on("data", chunk => { // lee los datos de una fuente
    console.log("Reading chunk....");
    console.log(chunk.length);

});

readStream.on("end", () => console.log("stream ended"));
readStream.on("error", error => console.log("error was occurred reading stream.. ", error));

// leer datos de consola mediante stdin

//detener la leida de chunks
readStream.pause();

process.stdin.on("data", input => { // pregunta si hay mas chunks de entrada
    console.log("echo:  ", input.toString().trim());

    if (input.toString().trim() === "end") {
        readStream.resume(); // se consume los chunks sin pausa
    }
    readStream.read(); // con cada entender sigo leyendo datos
});

