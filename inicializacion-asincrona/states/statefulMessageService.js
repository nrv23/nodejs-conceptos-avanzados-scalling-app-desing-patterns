import { EventEmitter } from "events";
import { InitializedState } from "./initializedState.js";
import { QueuingState } from "./queuingState.js";

class MessageService extends EventEmitter {
  constructor() {
    super();
    this.state = new QueuingState(this); // start in QueuingState
  }

  async sendMessage(content) {
    return this.state.sendMessage(content);
  }

  authenticate() {
    setTimeout(() => {
      this.authenticated = true;
      this.emit("authenticated");
      const prevState = this.state;
      this.state = new InitializedState();
      prevState.disable();
    }, 1000);
  }
}

export const messageService = new MessageService();

/**
 ** What Happened Here?

    Initially, messageService is not authenticated, so it uses the QueuingState.
    Any sendMessage() calls are queued.
    Once authentication is done, we switch to InitializedState and run all queued commands.

** Why is this better?

    Less repetitive checks.
    The "ready or not" logic is handled inside the component itself.
    Different states separate the behaviors, making the code clearer and more maintainable.
 */
