const AbstractObserver = require("./abstract-observer");

class Web extends AbstractObserver {
  constructor(id) {

    if (!id) throw new Error("id is required");
    super(id);

  }

  update(temperature) {
    console.log(`💻 Web: Displaying the new temperature: ${temperature}°C`);
  }
}
module.exports = Web;
