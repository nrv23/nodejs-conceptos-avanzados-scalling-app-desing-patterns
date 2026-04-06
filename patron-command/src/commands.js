const fs = require("fs");

class Command {
  execute() {
    throw new Error("Method 'execute()' must be implemented.");
  }

  get name() {
    throw new Error("Method 'getName()' must be implemented.");
  }

  undo() {
    console.warn(`Undo no está implementado para el comando: ${this.name}`);
  }

}

class Create extends Command {
  constructor(fileName, fileContent) {
    super();
    this.fileName = fileName;
    this.fileContent = fileContent;
  }

  execute() {
    fs.writeFileSync(this.fileName, this.fileContent);
  }

  get name() {
    return "Create";
  }

  undo() { // deshacer el comando de creación de archivo
    fs.unlinkSync(this.fileName); // borrar archivo
  }
}

class Exit extends Command {
  execute() {
    console.log("Exiting the application...");
    process.exit(0);
  }

  get name() {
    return "Exit";
  }
}

module.exports = { Create, Exit };
