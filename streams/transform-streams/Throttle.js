import { Duplex } from "stream";

class Throttle extends Duplex {
    constructor(delay = 1) {
        super();
        this.delay = delay;
        this.queue = [];
    }

    _write(chunk, enc, callback) {
        console.log("📥 RECIBI");
        setTimeout(() => {
            this.queue.push(chunk);
            this._read();
            callback();
        }, this.delay * 1000);


    }

    _final(callback) {
        this.push(null);
        callback();
    }
}

export default Throttle;