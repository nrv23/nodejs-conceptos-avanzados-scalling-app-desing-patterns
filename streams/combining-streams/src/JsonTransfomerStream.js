import { Transform } from 'node:stream';


export function createJsonTransformerStream() {

    return new Transform({
        writableObjectMode: true,
        readableObjectMode: true,
        transform(chunk, enc, cb) {
            const jsonString = JSON.stringify(chunk).concat('\n');
            this.push(jsonString);
            cb()
        }
    })
}