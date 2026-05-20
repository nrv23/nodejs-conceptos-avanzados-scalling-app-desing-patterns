import fs from 'fs';

const readableStream = fs.createReadStream('./the-universe.mp4');
const writableStream = fs.createWriteStream('./test.txt');

const writableStreamText = fs.createWriteStream('./test1.txt');

readableStream.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);

});

readableStream.on('end', () => {
  console.log('No more data to read.');

});

readableStream.on("error", err => console.error(err));
// usar piping para manejar automaticamrnte el backpressure y simplificar el código y cierra los buffers de lectura y escritura automáticamente al finalizar la operación de copia, lo que ayuda a liberar recursos y evitar fugas de memoria.
readableStream.pipe(writableStream); // Este método es más eficiente y recomendado para copiar archivos grandes, ya que maneja el flujo de datos de manera más eficiente y evita problemas de memoria.

writableStream.on("error", err => console.error(err));
writableStream.on("finish", () => console.log("Archivo copiado exitosamente."));
writableStream.on("close", () => console.log("Stream de escritura cerrado."));

// escribir datos de la consola al txt 

process.stdin.pipe(writableStreamText); // El método pipe también se puede usar para escribir datos de la consola a un archivo de texto, lo que permite capturar la entrada del usuario y guardarla en un archivo de manera eficiente.