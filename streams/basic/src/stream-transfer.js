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
