import fs from 'fs';
import { promisify } from "util";

const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);
const timeout = (ms, msg, callback) => setTimeout(() => {
    callback(null, msg)
}, ms);

const timeoutPromisified = promisify(timeout);

const executeTaskInSequence = async () => {

    try {


        const msg1 = await timeoutPromisified(1000, "⏳ Waiting for the first timeout...")
        console.log(msg1);
        const msg2 = await timeoutPromisified(
            2000,
            "⏳ Waiting a bit more..."
        );
        console.log(msg2);
        // crrea el archivo
        await writeFileAsync(
            "test.txt",
            "texto"
        );
        console.log("Archivo creado con exito");
        // RETURN
        const msg3 = await timeoutPromisified(
            3000,
            "deleting file..."
        );
        console.log(msg3);
        // elimina el archivo
        await unlinkAsync("test.txt");


        console.log("🗑️ test.txt has been removed");
        console.log(
            "🏁 Sequential execution complete"
        );
    } catch (error) {
        return Promise.reject(error);
    }
}


await executeTaskInSequence();