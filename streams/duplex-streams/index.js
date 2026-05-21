import fs from 'fs';
import { PassThrough } from 'stream';

import Throttle from './Throttle.js';


/*
 * ============================================================================
 * GUÍA DE STREAMS: READABLE vs DUPLEX vs PASSTHROUGH
 * ============================================================================
 * 
 * 1. Readable Stream Normal:
 *    - Solo es un ORIGEN de datos (solo emite datos).
 *    - No puedes conectar tuberías (.pipe()) HACIA él, solo DESDE él.
 *    - Ejemplo: fs.createReadStream()
 * 
 * 2. Duplex Stream:
 *    - Es capaz de leer y escribir al mismo tiempo.
 *    - Actúa como ORIGEN y DESTINO. Sus flujos de entrada y salida suelen ser
 *      independientes (ej. un socket de red TCP, donde envías y recibes cosas distintas).
 * 
 * 3. PassThrough (Un tipo especial de Transform/Duplex):
 *    - Se puede colocar en MEDIO de una cadena de .pipe() porque puede recibir datos (Writable)
 *      y enviarlos al siguiente eslabón (Readable).
 *    - A diferencia de un Transform normal (como compresión gzip), NO MODIFICA los datos.
 *      Entra el chunk y sale el mismo chunk exacto.
 *    - ¿Para qué sirve? Permite "espiar" o monitorear el flujo (sumar bytes, progreso) 
 *      sin romper el "backpressure" automático de .pipe() y sin tener que mezclar lógicas.
 * ============================================================================
 */

/*
 * EJEMPLO: CONEXIÓN DE VARIOS STREAMS (PIPELINING) PARA MONITOREO
 * 
 * Descomenta este bloque para ver cómo un PassThrough permite monitorear 
 * un flujo de datos que va hacia un compresor y luego a un archivo.
 *
 * const videoReadable = fs.createReadStream('./the-universe.mp4');
 * const videoWritable = fs.createWriteStream('./copia.mp4.gz');
 * const compresorGzip = zlib.createGzip(); // Transform normal (Modifica los datos)
 * 
 * const monitor = new PassThrough(); // Transform especial (Solo observa)
 * let totalBytes = 0;
 * 
 * monitor.on('data', (chunk) => {
 *     totalBytes += chunk.length;
 *     console.log(`Monitoreo: Van ${totalBytes} bytes transferidos...`);
 * });
 * 
 * // Conexión estilo LEGO: 
 * // Origen -> Espía (monitor) -> Transformador (gzip) -> Destino final
 * videoReadable.pipe(monitor).pipe(compresorGzip).pipe(videoWritable);
 */

// --- CÓDIGO ORIGINAL ---

const readableStream = fs.createReadStream('./the-universe.mp4');
const writableStream = fs.createWriteStream('./test.txt');
const report = new PassThrough();
const throttle = new Throttle(1); // 20 milisegundos de espera por cada chunk
let fullSizeBuffer = 0;

report.on('data', (chunk) => { // monitoreo del flujo de datos sin modificarlo
    console.log("Leyendo stream... ", chunk);
    fullSizeBuffer += chunk.length;
});

report.on('end', () => { // monitoreo del flujo de datos sin modificarlo
    console.log(`Tamaño total del archivo: ${fullSizeBuffer}`);
});

readableStream
    .pipe(throttle)
    .pipe(report)
    .pipe(writableStream); // El PassThrough permite monitorear el flujo sin modificarlo ni romper la cadena de .pipe()
// lee y devuelve el mismo chunk, pero nos da la oportunidad de "espiar" el proceso de transferencia.
// puede conectar un readable a un writable, pero también puede conectar un readable a otro readable, o un writable a otro writable, lo que lo hace muy flexible para casos de monitoreo o logging.

// la diferencia de un PassThrough con un readable normal es que el PassThrough puede ser conectado a otro stream, mientras 
//que un readable normal no puede ser conectado a otro stream, solo puede emitir datos. 
//El PassThrough actúa como un intermediario que permite observar el flujo de datos sin modificarlo, lo que es útil para casos de monitoreo o logging.