const AbstractObserver = require("./abstract-observer");

class Phone extends AbstractObserver {

  constructor(id) {
    if (!id) throw new Error("id is required");
    super(id);

  }

  update(temperature) {
    console.log(`📱 Phone: The current temperature is ${temperature}°C`);
  }
}

module.exports = Phone;
