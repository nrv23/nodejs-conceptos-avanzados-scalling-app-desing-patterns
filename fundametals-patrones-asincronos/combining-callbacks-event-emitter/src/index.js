import { scanFolder } from "./scanFolder.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// We want to scan "myDir" for any files:
const dir = __dirname;
const emitter = scanFolder(dir, (err, allFiles) => {
  console.log("Using callback response....")
  if (err) {
    return console.error("Callback reported error:", err);
  }
  console.log("Callback final file list:", allFiles);
});

// Meanwhile, we can also get events in real-time:

console.log("");
console.log("Using even emitter.... ");
emitter
  .on("file", (filePath) => {
    console.log("A file was found:", filePath);
  })
  .on("done", (fileList) => {
    console.log("All done scanning, files are:", fileList);
  })
  .on("error", (error) => {
    console.log("An error occurred:", error.message);
  });
