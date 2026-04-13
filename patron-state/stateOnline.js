const AbstractState = require("./abstractState");

class StateOnline extends AbstractState {
    #socket;
    constructor(socket) {
        super();
        this.#socket = socket;
        this.#handleMessage();

    }

    sendMessage(message) {
        if (this.#socket && this.#socket.readyState === WebSocket.OPEN) {
            this.#socket.send(message, (err) => {
                if (err) {
                    console.log("Send error:", err.message);
                } else {
                    console.log(`Data sent: ${message}`);
                }
            });
        } else {
            console.log("Cannot send message. Not connected to the server.");
            // No message queuing or offline handling
        }
    }

    #handleMessage() {

        this.#socket.on("message", msg => {
            console.log(`\nReceived: ${msg}`);
            process.stdout.write(""); // Refresh prompt
        })
    }
}

module.exports = StateOnline;