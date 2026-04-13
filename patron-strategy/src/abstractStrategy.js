

class AbstractStrategy {
    strategyValue;
    constructor(strategyValue) {
        this.strategyValue = strategyValue;
    }

    pay(amount) {
        throw new Error(`mplement method pay with ${amount} argument and this strategy`);
    }
}

module.exports = AbstractStrategy;