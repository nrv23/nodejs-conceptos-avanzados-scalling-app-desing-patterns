
const Command = require("./command");
const fs = require("fs");

class Create extends Command {

    constructor(fileName, fileContent) {
        super();
        this.fileName = fileName;
        this.fileContent = fileContent;
        execute();
    }

    execute() {
        fs.writeFileSync(this.fileName, this.fileContent);
    }
}

module.exports = Create;