import { faker } from '@faker-js/faker';
import { createWriteStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url); // ruta del archivo
const __dirname = path.dirname(__filename); // con esa ruta del archivo actual, obtiene la ruta de la carpeta actual

function buildFakeUser() {

    return {
        user: faker.internet.username(),
        email: faker.internet.email(),
        phone: faker.phone.number({
            style: "human"
        })
    }
}


const fileA = createWriteStream(path.join(__dirname, "db", "./fileA.json"));
const fileB = createWriteStream(path.join(__dirname, "db", "./fileB.json"));
const fileC = createWriteStream(path.join(__dirname, "db", "./fileC.json"));


[fileA, fileB, fileC].forEach((file, index) => { // indices empiezan en 0

    const fileName = `file${["A", "B", "C"][0]}`;
    for (let index = 0; index < 100; index++) file.write(JSON.stringify(buildFakeUser()) + '\n');

    // sale del for cierra el writable stream

    file.end();

});