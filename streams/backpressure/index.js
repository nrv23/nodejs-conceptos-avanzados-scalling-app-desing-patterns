import fs from "fs";

const readableStream = fs.createReadStream("./the-universe.mp4");
const writableStream = fs.createWriteStream('./the-universe-copy.mp4',{
  highWaterMark: 16 * 1024 // El tamaño del buffer de escritura se establece en 16 KB, lo que significa que el writable stream aceptará hasta 16 KB de datos antes de generar un backpressure.
});// este tamaño es del buffer de escritura completo y no del chunk que se escribe, por lo que si el chunk es mayor a este tamaño, se generará un backpressure inmediatamente.
// Es importante ajustar este tamaño según las necesidades de la aplicación y el tamaño de los archivos que se están copiando para evitar problemas de memoria y rendimiento.
// el tamaño se represnta en bytes, por lo que 16 * 1024 es igual a 16 KB. Si se desea un tamaño de buffer diferente, se puede ajustar el valor en consecuencia, por ejemplo, para un buffer de 64 KB se usaría 64 * 1024.


readableStream.on("data", chunk => {
  console.log(`Received ${chunk.length} bytes of data.`);

  // validar si el buffer de escritura está lleno antes de escribir más datos, o sea generando un backpressure

  const canContinueWriting  = writableStream.write(chunk); // si retorna false, significa que el buffer de escritura está lleno y no se pueden escribir más datos hasta que se vacíe, lo que genera un backpressure
  if (!canContinueWriting ) {
    console.log(
      "El buffer de escritura está lleno, esperando a que se vacíe..."
    );
    readableStream.pause(); // se detiene el readable para no perder datos mientras se vacía el buffer de escritura
  } else {
    console.log("Datos escritos en el buffer de escritura, continuando...");
  }
});
readableStream.on("end", () => {
  console.log("No more data to read.");
  writableStream.end();
});

readableStream.on("error", err => console.error(err));

writableStream.on("error", err => console.error(err));
writableStream.on("finish", () => console.log("Archivo copiado exitosamente."));
writableStream.on("close", () => console.log("Stream de escritura cerrado."));
writableStream.on("drain", () => {
  console.log(
    "El buffer de escritura se ha vaciado, puedes escribir más datos."
  );
  readableStream.resume(); // se reanuda el readable para seguir leyendo datos y escribiéndolos en el writable
  // El evento 'drain' se emite cuando el buffer de escritura se ha vaciado y está listo para recibir más datos. En este caso, se reanuda el readable para seguir leyendo datos y escribiéndolos en el writable.
});

