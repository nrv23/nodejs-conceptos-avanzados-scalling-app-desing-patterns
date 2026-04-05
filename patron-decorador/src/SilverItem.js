const ComponentDecorator = require("./ProductDecorator");

class SilverItem extends ComponentDecorator {
  constructor(component) {
    super(component);
  }

  get itemName() {
    return `${this.component.itemName} (Silver Edition)`;
  }

  get itemCost() {
    return this.component.itemCost * 1.2; // Silver edition costs 20% more
  }

  showDetails() {
    console.log(`${this.itemName} is priced at $${this.itemCost}`);
  }
}

module.exports = SilverItem;
