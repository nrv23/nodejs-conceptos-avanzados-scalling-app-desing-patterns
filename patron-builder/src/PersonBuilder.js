const Customer = require("./Customer");

class PersonBuilder {

    /**
     *
     */
    constructor(name) {
        //super();
        this.name = name;
        this.isEmployee = false;
        this.isManager = false;
        this.hours = 40;
        this.funds = 0;
        this.shoppingList = []
    }

    makeEmployee() {
        this.isEmployee = true;
        return this;
    }

    makeManager(hours) {
        this.isManager = true;
        this.hours = hours;
        return this;
    }

    withFunds(funds) {
        this.funds = funds;
        return this;
    }

    withList(list) {
        this.shoppingList = !list ? [] : list;
        return this;
    }

    build() {
        return new Customer({
            name: this.name,
            isEmployee: this.isEmployee,
            isManager: this.isManager,
            hours: this.hours,
            funds: this.funds,
            list: this.list,
            shoppingList: this.shoppingList
        });
    }
};


module.exports = { PersonBuilder };