import { readdir, stat } from "fs";
import { join } from "path";
import { EventEmitter } from "events";

/**
 * scanFolder(folderPath, callback)
 * - folderPath: the directory we want to scan
 * - callback: an optional callback to receive the final file list
 *
 * returns: an EventEmitter that emits:
 *    "file" -> each time a file is found
 *    "done" -> when scanning is finished
 *    "error"-> if there's an error
 */
export function scanFolder(folderPath, callback) {
  const emitter = new EventEmitter();
  let finalFileList = [];

  // read the directory
  readdir(folderPath, (err, items) => {
    if (err) {
      // use the emitter to notify there's an error
      emitter.emit("error", err);
      // callback with error (if provided)
      if (callback) callback(err);
      return;
    }

    let pending = items.length;
    if (!pending) {
      // empty folder
      emitter.emit("done", []);
      if (callback) callback(null, []);
      return;
    }

    // check each item in the folder
    items.forEach((itemName) => {
      const fullPath = join(folderPath, itemName);
      stat(fullPath, (errStat, stats) => {
        if (errStat) {
          emitter.emit("error", errStat);
        } else {
          if (stats.isFile()) {
            // we found a file, let's report it
            emitter.emit("file", fullPath);
            finalFileList.push(fullPath);
          }
        }

        if (!--pending) {
          // scanning is done
          emitter.emit("done", finalFileList);
          if (callback) callback(null, finalFileList);
        }
      });
    });
  });

  return emitter;
}
