import { Duplex } from "stream";

class Throttle extends Duplex { // por sr un stream duplex _write si puede usar push para publicar chunk en el buffer de lectura
    constructor(delay = 1) {
        super();
        this.delay = delay;

    }

    _write(chunk, enc, callback) {
        console.log("📥 RECIBI");
        setTimeout(() => {
            this.push(chunk);
            callback();
        }, this.delay);


    }

    _read() {

    }

    _final(callback) {
        this.push(null);
        callback();
    }
}

export default Throttle;