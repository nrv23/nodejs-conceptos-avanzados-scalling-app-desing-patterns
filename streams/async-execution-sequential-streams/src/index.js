import { createReadStream, createWriteStream } from "node:fs";
import { Readable, Transform } from "node:stream";


function myTransform(resultFile, isTheFirstLineInFirstFile) {
    return new Transform({
        transform(chunk, enc, cb) { // chunk seria el nombre de cada archivo
            console.log({ chunk });

            const src = createReadStream(chunk, {
                encoding: enc || 'utf-8'
            });


            src.on("data", data => {
                const lines = data.split('\n'); // separar por nueva linea
                console.log({ lines });
                lines.forEach((line, index) => {
                    console.log({ line });
                    if (index === 0 && !isTheFirstLineInFirstFile) return; // omitir textos de titulos de los otros archivos
                    /*

                        Deja en true al principio por ser el primer archivo, luego al validar if (index === 0 && !firstFile) return; 
                        lo que p[regunta es que si es el primer archivo primera linea, copia los titulos, sino es el primer archivo 
                        y el indice es 0 entonces ignora para no copiar totulos por cada chunk que seria un archivo. 

                    */

                    if (line.trim()) {
                        resultFile.write(line + '\n');
                    }

                });
            });

            src.once('end', _ => {

                isTheFirstLineInFirstFile = false;
                cb();
            });

            src.on('error', cb);

        },
        objectMode: true
        /*

        Si el chunk es  texto o bytes → no necesitás objectMode.
        Si el chunk representa un objeto de clase, interfaz o anonimo  → sí necesitás objectMode. 🚀

    */
    })
}

function concatCsvFiles(resultFile, csvFiles = []) { // csvFiles es un array de nombres de archivos csv, un array de strings

    return new Promise((resolve, reject) => {
        let isTheFirstLineInFirstFile = true;
        const resultStream = createWriteStream(resultFile);

        Readable.from(csvFiles)
            .pipe(myTransform(resultStream, isTheFirstLineInFirstFile))
            .on("error", reject)
            .on("finish", _ => {
                resultStream.end(); // cierra el buffer
                resolve('Se ha generado el archivo csv');
            })
    })
}

concatCsvFiles(
    "./finalResult.csv",
    ["./f1.csv", "./f2.csv", "./f3.csv"]
)
    .then(console.log)
    .catch(console.error);


