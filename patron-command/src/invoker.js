class Invoker {
  constructor() {
    this.trace = [];
    this.undoStack = [];
  }

  run(command) {
    console.log(`Executing command: ${command.name}`);
    command.execute();
    this.trace.push(command);
  }

  printTrace() {
    // muestra el historial de comandos ejecutados
    console.log("Command execution trace:");
    this.trace.forEach(cmd => console.log(JSON.stringify(cmd)));
  }

  undo() {
    // deshace el último comando ejecutado
    if (this.trace.length === 0) {
      console.log("No commands to undo.");
      return;
    }

    const lastCommand = this.trace.pop();
    console.log(`Undoing command: ${lastCommand.name}`);
    lastCommand.undo();
    this.undoStack.push(lastCommand);
  }

  redo() {
    // vuelve a ejecutar el último comando deshecho
    if (this.undoStack.length === 0) {
      console.log("No commands to redo.");
      return;
    }
    const commandToRedo = this.undoStack.pop();
    console.log(`Redoing command: ${commandToRedo.name}`);
    commandToRedo.execute();
    this.trace.push(commandToRedo);
  }
}

module.exports = new Invoker();
