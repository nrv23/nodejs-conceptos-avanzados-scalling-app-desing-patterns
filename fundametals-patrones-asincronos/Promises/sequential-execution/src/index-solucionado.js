const fs = require("fs");
const { promisify } = require("util");

const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);
const timeout = (ms, msg, callback) => setTimeout(() => {
    callback(null, msg)
}, ms);

const timeoutPromisified = promisify(timeout);


timeoutPromisified(1000, "⏳ Waiting for the first timeout...")
    .then(msg1 => {
        console.log(msg1)
        timeoutPromisified(2000, "⏳ Waiting a bit more...")
            .then(msg2 => {
                console.log(msg2)
                writeFileAsync("test.txt", "texto")
                    .then(created => {
                        console.log("Archivo creado con exito");
                        timeoutPromisified(3000, "deleting file...")
                            .then(() => {
                                unlinkAsync("test.txt")
                                    .then(deleted => {
                                        console.log("🗑️ test.txt has been removed");
                                        console.log("🏁 Sequential execution complete");
                                    })
                                    .catch(console.log)
                            })
                            .catch(console.log)
                    })
                    .catch(err => console.log("Error al crear el archivo", err.message));
            })
            .catch(console.log)
    })
    .catch(console.log);