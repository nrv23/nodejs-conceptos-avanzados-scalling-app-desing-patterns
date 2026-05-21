import { Duplex } from "stream";

class Throttle extends Duplex {
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