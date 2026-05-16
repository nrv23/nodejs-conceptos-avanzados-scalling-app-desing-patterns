import fs from "fs";
import http from "http";

const file = "./the-universe.mp4"; // 🎥 Path to the video file

http
  .createServer((req, res) => {
    // 📥 Reading the video file from the file system
    fs.readFile(file, (error, data) => {
      if (error) {
        // 🚨 Logging any errors that occur during file reading
        console.log("Ooops: ", error);
        // 🛑 Sending a 500 Internal Server Error response if an error occurs
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      }
      res.writeHead(200, { "Content-Type": "video/mp4" });
      // 📤 Sending the video file as the response
      res.end(data);
    });
  })
  .listen(3000, () =>
    console.log("Buffer server running at http://localhost:3000")
  );
