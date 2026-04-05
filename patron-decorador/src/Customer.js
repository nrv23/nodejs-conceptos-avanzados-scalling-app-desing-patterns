class Customer {
  constructor(customerName, balance = 0) {
    this.customerName = customerName;
    this.balance = balance;
    this.purchasedItems = [];
  }

  buy(item) {
    if (+this.balance === 0 || +item.itemCost > +this.balance) {
      console.log(`Insufficient funds to purchase ${item.itemName}`);
    } else {
      console.log(`Purchasing ${item.itemName}`);
      this.balance -= item.itemCost;
      this.purchasedItems.push(item);
    }
  }

  displayStatus() {
    console.log(
      `${this.customerName} has purchased ${this.purchasedItems.length} item(s):`
    );
    this.purchasedItems.forEach((item) => {
      console.log(`   * ${item.itemName} - $${item.itemCost}`);
    });
    console.log(`${this.customerName} has $${this.balance.toFixed(2)} left.`);
  }
}

module.exports = Customer;
