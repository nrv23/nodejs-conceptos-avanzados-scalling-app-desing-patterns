var Logger = require("./Logger");

class Product {
  constructor(name, inventory = []) {
    this.name = name;
    this.inventory = inventory;
    Logger.log(`New Product: ${name} has ${inventory.length} items in stock.`);
  }
}

module.exports = Product;
