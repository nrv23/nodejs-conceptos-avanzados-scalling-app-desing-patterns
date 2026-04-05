class Config {

  constructor(setup) {
    const settings = {
      port: 8080,
      env: "production",
    };
    const configurator = {

      set: (key, value) => {
        if (typeof key !== "string" || key.trim() === "") {
          throw new Error("Config key must be a non-empty string.");
        }
        settings[key] = value;
      },
      setMultiple: (newSettings) => { // se pueden agregar o modificar propiedades, pero no eliminar
        if (!newSettings || typeof newSettings !== "object" || Array.isArray(newSettings)) {
          throw new Error("setMultiple expects an object with key/value pairs.");
        }
        Object.assign(settings, newSettings); // copia las propiedades de newSettings a settings, sobrescribiendo las existentes si hay claves iguales
      },
      get : (key) => settings[key],
    };

    if (typeof setup === "function") {
      setup(configurator);
    }
    // hacer inmutable
    Object.freeze(settings); // no se pueden agregar, eliminar o modificar propiedades
    this.get = (key) => settings[key];
    this.getAll = () => ({...settings});
  }

}

module.exports = Config;