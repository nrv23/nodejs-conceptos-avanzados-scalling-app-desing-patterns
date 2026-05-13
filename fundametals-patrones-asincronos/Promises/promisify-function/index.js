import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const dirname = import.meta.dirname;
const wait = (sec, callback) => {
    if (!sec || typeof sec !== "number") return callback(new Error("sec is not valid"), null);

    setTimeout(() => {
        callback(null, `${sec} seconds is fisnished`);
    }, sec);
}

const reader = promisify(fs.readFile);
const promisified = promisify(wait); //promisify cpnvierte un metodo que devuelve callback en un metood que retorna promesas
const writer = promisify(fs.writeFile);

promisified(1)
    .then(console.log)
    .catch(console.log);


reader(path.join(dirname, '..', 'rejecting-promises', 'index.js'), 'utf-8')
    .then(fileData => fileData)
    .then(data => {
        console.log("Reading file data....");
        console.log(data);
    })
    .catch(err => console.log(err));

writer("test.txt", "archivo creado desde metodo usando promisify")
    .then(() => console.log(`Se creó el archivo con éxito`))
    .catch(err => console.log(`Error al generar el archivo : ${err.message}`))