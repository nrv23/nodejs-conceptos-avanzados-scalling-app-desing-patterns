import fs from 'fs';

const readableStream = fs.createReadStream('./the-universe.mp4');
const writableStream = fs.createWriteStream('./the-universe-copy.mp4',{
  highWaterMark: 16 * 1024 // El tamaño del buffer de escritura se establece en 16 KB, lo que significa que el writable stream aceptará hasta 16 KB de datos antes de generar un backpressure.
});// este tamaño es del buffer de escritura completo y no del chunk que se escribe, por lo que si el chunk es mayor a este tamaño, se generará un backpressure inmediatamente.
// Es importante ajustar este tamaño según las necesidades de la aplicación y el tamaño de los archivos que se están copiando para evitar problemas de memoria y rendimiento.
// el tamaño se represnta en bytes, por lo que 16 * 1024 es igual a 16 KB. Si se desea un tamaño de buffer diferente, se puede ajustar el valor en consecuencia, por ejemplo, para un buffer de 64 KB se usaría 64 * 1024.

readableStream.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);

  writableStream.write(chunk); // usando streams va generar un buffer y lo va escribir en el nuevo archivo, sin necesidad de cargar todo el archivo en memoria
});
readableStream.on('end', () => {
  console.log('No more data to read.');
    writableStream.end(); // cerrar el stream de escritura
});

readableStream.on("error", err => console.error(err));

// También se puede usar el método pipe para conectar el stream de lectura con el de escritura, lo que simplifica el código y maneja automáticamente los eventos de error y finalización.
// readableStream.pipe(writableStream); // Este método es más eficiente y recomendado para copiar archivos grandes, ya que maneja el flujo de datos de manera más eficiente y evita problemas de memoria.
// eventos del stream de escritura
writableStream.on("error", err => console.error(err));
writableStream.on("finish", () => console.log("Archivo copiado exitosamente."));
writableStream.on("close", () => console.log("Stream de escritura cerrado."));// El evento 'close' se emite cuando el stream de escritura se cierra, ya sea por un error o por una finalización exitosa.
//Es importante manejar este evento para liberar recursos y evitar fugas de memoria.
writableStream.on
("drain", () => console.log("El buffer de escritura se ha vaciado, puedes escribir más datos."));
writableStream.on("pipe", (src) => console.log(`El stream de lectura ${src} se ha conectado al stream de escritura.`));
writableStream.on("unpipe", (src) => console.log(`El stream de lectura ${src} se ha desconectado del stream de escritura.`));
