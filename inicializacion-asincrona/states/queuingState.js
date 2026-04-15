const FUNCTIONS_NEED_AUTH = ["sendMessage"];

class QueuingState {
  constructor(service) {
    this.service = service;
    this.commandsQueue = [];

    FUNCTIONS_NEED_AUTH.forEach((methodName) => {
      this[methodName] = (...args) => {
        console.log("Command queued:", methodName, args);
        return new Promise((resolve, reject) => {
          const command = () => {
            service[methodName](...args).then(resolve, reject);
          };
          this.commandsQueue.push(command);
        });
      };
    });
  }

  /**
   * This function is
called when the queuing state is disabled (and this happens when the initialization is done.)
and it executes all the commands in the queue. 

   */

  disable() {
    this.commandsQueue.forEach((command) => command());
    this.commandsQueue = [];
  }
}

export { QueuingState };
