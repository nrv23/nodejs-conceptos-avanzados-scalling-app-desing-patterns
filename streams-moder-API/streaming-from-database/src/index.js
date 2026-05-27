import sqlite3 from 'sqlite3';
import { promisify } from 'node:util';
import { Readable } from 'node:stream';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

const connection = sqlite3.verbose();
const db = new connection.Database("../data/db");

const promisifiedAll = promisify(db.all.bind(db));

async function* findAllStream() { // devuelve un generador que es un array de datos
    const pageLimit = 10;
    let skip = 0;

    while (true) {
        const data = await promisifiedAll(
            `SELECT * FROM users LIMIT ? OFFSET ?`,
            [pageLimit, skip]
        );

        if (!data.length) break;

        skip += pageLimit;

        for (const row of data) {
            yield row;
        }
    }
}

// lee el generador como stream chunk by chunk y usa los high order functions de los arrays
const stream = Readable.from(findAllStream())
    .filter(({ age }) => age > 59)
    .map(async chunk => {
        const newName = await Promise.resolve(chunk.name + '_updated');
        const newAge = await Promise.resolve(+chunk.age + 10);

        return { // spread operator
            ...chunk,
            name: newName,
            age: newAge,
            editedAt: Date.now()
        }
    })
    .map(chunk => JSON.stringify(chunk) + '\n');

await pipeline(stream, createWriteStream('./data.json', {
    encoding: 'utf8'
}));