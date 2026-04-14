const ConfigManager = require("./configManager");
const yaml = require("js-yaml"); // Install via npm: npm install js-yaml

class YamlConfigManager extends ConfigManager {
  parse(data) {
    return yaml.load(data);
  }

  stringify(data) {
    return yaml.dump(data);
  }
}

module.exports = YamlConfigManager;
