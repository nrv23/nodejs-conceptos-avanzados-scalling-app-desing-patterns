

class Handle {
    constructor() {
        this.nextHandler = null;
    }

    setNext(handler) {
        this.nextHandler = handler;
        return handler; // for chaining
    }

    handle(request) {
        if (this.nextHandler) {
            this.nextHandler.handle(request);
        } else {
            console.log("No handler was able to handle the request.");
        }
    }
}

module.exports = Handle;