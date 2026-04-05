const AbstractDetails = require("./abstracDetails");

class Product extends AbstractDetails {
  constructor(productName, productPrice) {
    super();
    this.productName = productName;
    this.productPrice = productPrice;
  }

  get total() {
    return this.productPrice;
  }

  printDetails() {
    console.log(`${this.productName}: $${this.productPrice}`);
  }
}

module.exports = Product;
