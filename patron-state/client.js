const WebSocket = require("ws");
const readline = require("readline");
const StateOffline = require("./stateOffline");
const StateOnline = require("./stateOnline");

class ChatClient {
  #estadoActual;

  constructor(url) {
    this.url = url;
    this.#estadoActual = new StateOffline();
    this.#setupInput();
    this.#checkConnection();
  }

  #checkConnection() {
    this.#estadoActual.connect(this.url, (socket, error) => {
      if (socket) {
        const oldState = this.#estadoActual;
        this.#estadoActual = new StateOnline(socket);
        this.#resendPendingMessages(oldState);

        // --- MAGIA NUEVA: ¿Qué pasa si se cae el server mientras estamos ONLINE? ---
        socket.on("close", () => {
          console.log("\n⚠️ Se perdió la conexión. Pasando a Modo Offline automático...");
          this.#estadoActual = new StateOffline();
          this.#checkConnection(); // Volvemos a arrancar el bucle de reintentos
        });

      } else {
        console.log(error);
      }
    });
  }

  #resendPendingMessages(oldState) {
    if (oldState.getPendingMessages) {
      const pendingMessages = oldState.getPendingMessages();
      if (pendingMessages.length > 0) {
        pendingMessages.forEach(msg => this.#estadoActual.sendMessage(msg));
        oldState.dropPendingMessages();
      }
    }
  }

  #setupInput() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "",
    });

    rl.on("line", (line) => {
      const message = line.trim();
      if (message) {
        this.#estadoActual.sendMessage(message);
      }
    });
  }
}

// Start the client
new ChatClient("ws://localhost:8080");
