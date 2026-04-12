class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }

  writeLn() {
    process.stdout.write("Current product --------- ");
    process.stdout.write(`${this.name}: $${this.price} `);

  }
}

module.exports = Product;
