import fs from 'fs';

/*
 * ============================================================================
 * NOTAS DE APRENDIZAJE SOBRE STREAMS EN NODE.JS
 * ============================================================================
 * 
 * 1. Modo Fluido (Flowing Mode):
 *    - Se activa al escuchar el evento `.on('data', ...)`.
 *    - Node.js lee y empuja los datos automáticamente tan rápido como puede.
 *    - El flujo se controla y pausa usando `stream.pause()` y `stream.resume()`.
 * 
 * 2. Modo No Fluido (Non-Flowing Mode) [ESTE CASO]:
 *    - Se activa al escuchar el evento `.on('readable', ...)`.
 *    - Los datos se quedan en el búfer interno; Node.js NO los envía solos.
 *    - Debes pedir los datos activamente llamando a `stream.read()`.
 *    - Para pausar en este modo, simplemente dejas de llamar a `read()`. Por 
 *      eso usamos la bandera `autoFlow = false` en lugar de `stream.pause()`.
 * 
 * * REGLA DE ORO: Evita mezclar `.on('data')` con `.read()`, ya que puede 
 *   causar pérdida de datos e inestabilidad en el estado del stream.
 * ============================================================================
 */

// leer un video usando streams
const readStream = fs.createReadStream('./../the-universe.mp4');

let autoFlow = false;

console.log("=== Stream de Video Iniciado ===");
console.log("Instrucciones:");
console.log("- Presiona [ENTER] para leer un solo chunk manual.");
console.log("- Escribe [end] para reproducir/transmitir todo automáticamente.");
console.log("- Escribe [pause] para pausar la transmisión automática.");
process.stdout.write("> ");

// El evento "readable" avisa que hay datos listos en el búfer
readStream.on("readable", () => {
    if (autoFlow) {
        // Si la transmisión automática está activa, consumimos todo lo que vaya llegando
        let chunk;
        while ((chunk = readStream.read()) !== null) {
            console.log("Reading chunk....", chunk.length);
        }
    }
});

readStream.on("end", () => console.log("\nstream ended"));
readStream.on("error", error => console.log("error was occurred reading stream.. ", error));

process.stdin.on("data", input => {
    const command = input.toString().trim();
    console.log("echo:  ", command);

    if (command === "end") {
        autoFlow = true;
        console.log("--- Transmisión automática activada ---");
        // Consumimos lo que haya en el búfer en este momento
        let chunk;
        while ((chunk = readStream.read()) !== null) {
            console.log("Reading chunk....", chunk.length);
        }
    } else if (command === "pause") {
        autoFlow = false;
        console.log("--- Transmisión automática pausada ---");
        process.stdout.write("> ");
    } else if (!autoFlow) {
        // Con cada Enter, leemos y procesamos un solo chunk de forma manual
        const chunk = readStream.read();
        if (chunk) {
            console.log("Reading chunk....", chunk.length);
        } else {
            console.log("Búfer vacío. Presiona Enter nuevamente o espera a que se carguen más datos.");
        }
        process.stdout.write("> ");
    }
});
