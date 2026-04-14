const JsonConfigManager = require("./jsonConfigManager");
const YamlConfigManager = require("./yamlConfigManager");

async function main() {
  // JSON Config Manager
  const jsonConfig = new JsonConfigManager();
  await jsonConfig.loadConfig("config.json");
  jsonConfig.set("appName", "MyApp");
  await jsonConfig.saveConfig("config_modified.json");
  console.log("JSON configuration saved.");

  // YAML Config Manager
  const yamlConfig = new YamlConfigManager();
  await yamlConfig.loadConfig("config.yaml");
  yamlConfig.set("appName", "MyApp");
  await yamlConfig.saveConfig("config_modified.yaml");
  console.log("YAML configuration saved.");
}

main().catch((error) => console.error(error));
