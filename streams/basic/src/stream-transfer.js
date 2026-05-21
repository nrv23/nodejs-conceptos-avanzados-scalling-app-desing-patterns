import fs from "fs";
import http from "http";

const file = "./the-universe.mp4"; // 🎥 Path to the video file

http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "video/mp4" });

    // Creating a read stream for the video file and piping it to the response
    fs.createReadStream(file)
      .pipe(res) // mientras lee chunks del video, se va cargando en el response, porque el objeto response es un stream
      .on("error", console.error);
  })
  .listen(3000, () =>
    console.log(" Stream server running at http://localhost:3000")
  );


  /*
  DIFERENCIA ENTRE stream.on("data") y stream.read()

  Ambos leen datos de un Readable Stream.

  La diferencia NO es que uno lea todo y otro por partes.
  Ambos trabajan por chunks.

  La diferencia real es:

  QUIÉN CONTROLA CUÁNDO LEER EL SIGUIENTE CHUNK.


  =========================================================
  1. stream.on("data")
  =========================================================

  Activa el stream en FLOWING MODE.

  En este modo el stream controla el flujo automáticamente.

  Flujo:

  stream
  ↓
  lee chunk
  ↓
  emite evento data
  ↓
  lee siguiente chunk
  ↓
  emite evento data
  ↓
  ...

  Ejemplo:

  stream.on("data", chunk => {
    console.log(chunk);
  });

  Características:

  ✔ lectura automática
  ✔ el stream sigue leyendo solo
  ✔ trabaja chunk por chunk
  ✔ útil para procesamiento continuo
  ✔ usado por pipe()

  Ejemplos:
  - lectura de archivos
  - streaming de videos
  - uploads
  - sockets


  =========================================================
  2. stream.read()
  =========================================================

  Usa el stream en PAUSED MODE.

  En este modo VOS decidís cuándo leer.

  Flujo:

  stream
  ↓
  espera
  ↓
  read()
  ↓
  entrega chunk
  ↓
  espera nuevamente

  Ejemplo:

  stream.pause();

  const chunk = stream.read();

  Características:

  ✔ lectura manual
  ✔ vos controlás el ritmo
  ✔ permite leer cuando querás
  ✔ útil para control fino


  =========================================================
  pause() y resume()
  =========================================================

  pause()
  → detiene lectura automática

  resume()
  → vuelve a lectura automática


  =========================================================
  Resumen mental
  =========================================================

  stream.on("data")
  =
  "Leé solo"

  stream.read()
  =
  "Esperá que yo te diga cuándo leer"

*/