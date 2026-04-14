import { EventEmitter } from "events";

class MessageService extends EventEmitter {
  authenticated = false;

  authenticate() {
    // Simulate network delay to get a token
    setTimeout(() => {
      this.authenticated = true;
      this.emit("authenticated");
    }, 1000);
  }

  async sendMessage(content) {
    if (!this.authenticated) {
      throw new Error("Not authenticated yet");
    }
    console.log(`Message sent: ${content}`);
  }
}

export const messageService = new MessageService();
