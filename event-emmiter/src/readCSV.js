import { EventEmitter } from "events";
import { readFile } from "fs";

export function searchRecordsInCsv(files, searchTerm) {
  const emitter = new EventEmitter();

  for (const file of files) {
    readFile(file, "utf8", (err, data) => {
      if (err) {
        // if reading fails, emit an 'error' event
        return emitter.emit("error", err);
      }

      // Let listeners know we finished reading this particular CSV
      emitter.emit("fileRead", file);

      // Split CSV into lines
      const lines = data.trim().split("\n");

      // The first line might be column headers, so skip it or parse it if needed
      // Then check each record for 'searchTerm'
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(",");
        // For example, let's assume searchTerm is an exact match in any column
        const found = row.some((col) => col.includes(searchTerm));
        if (found) {
          // Emit 'recordFound' with details
          emitter.emit("recordFound", file, row);
        }
      }
    });
  }
  return emitter;
}
