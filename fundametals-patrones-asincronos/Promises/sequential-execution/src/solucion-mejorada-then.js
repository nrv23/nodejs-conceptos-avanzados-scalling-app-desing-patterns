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
        console.log(msg1);
        // RETURN
        return timeoutPromisified(
            2000,
            "⏳ Waiting a bit more..."
        );
    })
    .then(msg2 => {
        console.log(msg2);
        // RETURN
        return writeFileAsync(
            "test.txt",
            "texto"
        );
    })
    .then(() => {
        console.log("Archivo creado con exito");
        // RETURN
        return timeoutPromisified(
            3000,
            "deleting file..."
        );
    })
    .then(msg => {
        console.log(msg);
        // RETURN
        return unlinkAsync("test.txt");
    })
    .then(() => {
        console.log("🗑️ test.txt has been removed");
        console.log(
            "🏁 Sequential execution complete"
        );
    })
    .catch(err => {
        console.log(err);
    });