const { WebSocket } = require("ws");
const AbstractState = require("./abstractState");

class StateOffline extends AbstractState {
    #socket
    #pendingMessages = [];
    constructor() {
        super();
    }
    sendMessage(message) {

        this.#pendingMessages.push(message);

    }

    connect(url, callback) {
        console.log("Arrancando la rutina de (re)conexión...")

        const tryConnect = () => {
            this.#socket = new WebSocket(url);

            this.#socket.on("open", () => {
                console.log("✅ Servidor encontrado. ¡Conectado!");
                return callback(this.#socket, null);
            });

            this.#socket.on("error", (error) => {
                console.log("❌ Server apagado o inalcanzable. Reintentando en 3 segundos...");
                // Volvemos a probar en 3 segundos creando un socket fresco
                setTimeout(tryConnect, 3000);
            });

            this.#socket.on("close", () => {
                // Este close sirve para cuando la conexion falla apenas arranca
            });
        };

        tryConnect();
    }

    getPendingMessages() {
        return this.#pendingMessages;
    }

    dropPendingMessages() {
        this.#pendingMessages = [];
    }
}

module.exports = StateOffline;