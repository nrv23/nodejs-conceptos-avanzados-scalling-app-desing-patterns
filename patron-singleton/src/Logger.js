class Logger {
  constructor() {
    this.logs = [];
  }

  get count() {
    return this.logs.length;
  }

  log(message) {
    const timestamp = new Date().toISOString();
    this.logs.push({ message, timestamp });
    console.log(`${timestamp} - ${message}`);
  }
}

// generacion del patron singleton para usar siempre la misma instancia de logger

class SingletonLogger {
  constructor() {
     if (!SingletonLogger.instance) {
      SingletonLogger.instance = new Logger();
    }
    return SingletonLogger.instance; // Retorna la instancia en lugar de 'this'
  }
}


module.exports = new SingletonLogger();
