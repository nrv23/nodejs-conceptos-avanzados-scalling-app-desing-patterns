class Customer {
  constructor(
    builder
  ) {
    this.name = builder.name;
    this.isEmployee = builder.isEmployee;
    this.isManager = builder.isManager;
    this.hours = builder.hours;
    this.money = builder.funds;
    this.shoppingList = builder.shoppingList;
  }

  toString() {
    return JSON.stringify(this);
  }
}

module.exports = Customer;
