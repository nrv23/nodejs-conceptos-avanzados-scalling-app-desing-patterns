const AbstractStrategy = require("./abstractStrategy");


class BankTransferStrategy extends AbstractStrategy {

    constructor(strategyValue) {
        super(strategyValue);
    }

    pay(amount) {
        console.log(`paying ${amount} with this account number ${this.strategyValue}....`);
    }
}

class PayPalStrategy extends AbstractStrategy {

    constructor(strategyValue) {
        super(strategyValue);
    }

    pay(amount) {
        console.log(`paying ${amount}...`);
        console.log(`Sending confirmation email to account :${this.strategyValue}....`);
    }
}



class CreditCardStrategy extends AbstractStrategy {

    constructor(strategyValue) {
        super(strategyValue);
    }

    pay(amount) {
        console.log(`paying ${amount} with this credit card number ${this.strategyValue}....`);
    }
}


module.exports = { PayPalStrategy, BankTransferStrategy, CreditCardStrategy };
