class Customer {
  constructor(name = "no name") {
    this._name = name;
    this._cartItems = [];
  }

  set name(value) {
    this._name = value;
  }

  get name() {
    return this._name;
  }

  get cartItems() {
    return this._cartItems.join(", ");
  }

  addItemToList(item) {
    this._cartItems.push(item);
  }

  clone() {

    var proto = Object.getPrototypeOf(this); // Get the prototype of the current instance
    var clone = Object.create(proto);
    clone._name = this._name;
    clone._cartItems = [...this._cartItems];
    return clone;
  }
}

module.exports = Customer;
