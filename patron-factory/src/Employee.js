var Customer = require("./Customer");

class Employee extends Customer {
  constructor(name, funds = 0, employer = "") {
    super(name, funds);
    this.employer = employer;
    this.employed = true;
  }

  payDay(funds = 0) {
    this.funds += funds;
  }
}

module.exports = Employee;
