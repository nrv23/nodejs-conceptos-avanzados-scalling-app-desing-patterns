const fs = require("fs").promises;

class ConfigManager {
  constructor() {
    this.configData = {};
  }

  async loadConfig(filePath) {
    const data = await fs.readFile(filePath, "utf8");
    this.configData = this.parse(data);
  }

  async saveConfig(filePath) {
    const data = this.stringify(this.configData);
    await fs.writeFile(filePath, data, "utf8");
  }

  get(key) {
    return this.configData[key];
  }

  set(key, value) {
    this.configData[key] = value;
  }

  // Abstract methods to be implemented by subclasses
  parse(data) {
    throw new Error("parse() must be implemented by subclass");
  }

  stringify(data) {
    throw new Error("stringify() must be implemented by subclass");
  }
}

module.exports = ConfigManager;
