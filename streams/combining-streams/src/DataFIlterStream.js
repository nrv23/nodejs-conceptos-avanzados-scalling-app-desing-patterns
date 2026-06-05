import { Transform } from "node:stream";


export function createDataFilterStream(criteria) {

    return new Transform({
        objectMode: true, // manejar chunks como objetos de Javascript,
        transform(chunk, enc, callback) {

            if (meetsCriteria(chunk, criteria)) {
                this.push(chunk); // publicar chunk para el siguiente stream que lo consume
            }

            callback();

        }
    });


    function meetsCriteria(record, criteria) {
        return record.age >= criteria.minAge
    };
}