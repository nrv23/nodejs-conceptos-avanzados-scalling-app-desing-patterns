const ConfigManager = require("./configManager");

class JsonConfigManager extends ConfigManager {
  parse(data) {
    return JSON.parse(data);
  }

  stringify(data) {
    return JSON.stringify(data, null, 2); // Pretty-print with 2-space indentation
  }
}

module.exports = JsonConfigManager;
