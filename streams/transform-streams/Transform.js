import { Transform } from "stream";

class TransformStream extends Transform {

    constructor() {
        super();

    }

    _transform(chunk, enc, callback) { // con este metodo recibimos los chunks, los transformamos y los enviamos al siguiente stream.

        if (!chunk) callback();
        console.log("cambiando chunk...");

        const text = chunk.toString().trim().toUpperCase();
        this.push(text);
        callback();

    }

    _final(callback) {
        this.push(null);
        callback();
    }

}

export default TransformStream;