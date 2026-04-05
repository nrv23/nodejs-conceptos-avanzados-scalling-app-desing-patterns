var Logger = require("./Logger");


class Customer {
  constructor(name, funds = 0) {
    this.name = name;
    this.funds = funds;
    Logger.log(`New Customer: ${name} has ${funds} in their account.`);
  }
}

module.exports = Customer;
