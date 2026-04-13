class PaymentProcessor {
  #strategy;
  processPayment(amount) {
    this.#strategy.pay(amount);
  }

  setStrategy(strategy) {
    this.#strategy = strategy;
  }
}

module.exports = PaymentProcessor;
