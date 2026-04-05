const AbstractDecorator = require("./AbstractDecorator");

class Item extends AbstractDecorator {
  constructor(itemName, itemCost) {
    super();
    this._itemName = itemName;
    this._itemCost = itemCost;
  }

  get itemName() {
    return this._itemName;
  }

  get itemCost() {
    return this._itemCost;
  }

  showDetails() {
    console.log(`${this.itemName} is priced at $${this.itemCost}`);
  }
}

module.exports = Item;
