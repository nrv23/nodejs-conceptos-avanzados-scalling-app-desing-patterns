class Person {
  constructor(name = "no name") {
    this.name = name;
  }

  toString() {
    return JSON.stringify(this);
  }
}

module.exports = Person;
