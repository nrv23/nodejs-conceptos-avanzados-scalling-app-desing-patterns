import { EventEmitter } from "events";

class MessageService extends EventEmitter {
    authenticated = false;
    commandQueues = [];
    authenticate() {
        // Simulate network delay to get a token
        console.log("Autenticando....")
        setTimeout(() => {
            this.authenticated = true;

            if (this.commandQueues.length) {
                this.commandQueues.forEach(msg => this.sendMessage("reenvio:  " + msg));
                this.commandQueues = [];
            }

            this.emit("authenticated");
        }, 1000);
    }

    sendMessage(content) {
        if (!this.authenticated) {
            this.commandQueues.push(content);
            console.log("-> Mensaje en cola: ", content);

            return Promise.resolve(content);

        }
        else console.log(`-> Message sent: ${content}`);
    }
}

export const messageService = new MessageService();
