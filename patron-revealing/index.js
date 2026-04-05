// index.js

const Config = require("./config");


// Create a new Config instance
const appConfig = new Config((config) => { // este config 
  // es el configurator que se pasa al callback del constructor de Config, y permite configurar las opciones durante la inicialización
  // Set configuration options during initialization
  config.set("port", 3000);
  config.set("env", "development");
  config.setMultiple({
    database: "myappdb",
    debug: true,
  });

  console.log(config.get("port")); // Output: 3000
});

// Access configuration settings
console.log("App Port:", appConfig.get("port")); // Output: App Port: 3000
console.log("All Settings:", appConfig.getAll());
/*
Output:
All Settings: {
  port: 3000,
  env: 'development',
  database: 'myappdb',
  debug: true
}
*/

// Attempting to modify the configuration after initialization
appConfig.getAll().port = 8000; // This won't change the internal settings

console.log("App Port after modification attempt:", appConfig.get("port")); // Still 3000
