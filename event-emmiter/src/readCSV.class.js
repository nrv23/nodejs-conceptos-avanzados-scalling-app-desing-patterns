import { EventEmitter } from "events";
import { readFile } from "fs";

class CsvSearcher extends EventEmitter { // hereda de event emmiter, entonces podemos usar metodos como .on, .emit, etc.
    constructor(searchTerm) {
        super();
        this.searchTerm = searchTerm;
        this.files = [];
    }

    addFile(filenames) { // se agrega uno o varios nombres
        this.files = [...filenames];
        return this; // retorno la instancia actual para poder usar los eventos de event emitter
    }


    search() {
        for (const file of this.files) {
            readFile(file, "utf8", (err, data) => {
                if (err) {
                    // if reading fails, emit an 'error' event
                    return this.emit("error", err);
                }

                // Let listeners know we finished reading this particular CSV
                this.emit("fileRead", file);

                // Split CSV into lines
                const lines = data.trim().split("\n");

                // The first line might be column headers, so skip it or parse it if needed
                // Then check each record for 'searchTerm'
                for (let i = 1; i < lines.length; i++) {
                    const row = lines[i].split(",");
                    // For example, let's assume searchTerm is an exact match in any column
                    const found = row.some((col) => col.includes(this.searchTerm));
                    if (found) {
                        // Emit 'recordFound' with details
                        this.emit("recordFound", file, row);
                    }
                }
            });
        }

        return this;
    }

}

export default CsvSearcher;