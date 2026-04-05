const ComponentDecorator = require("./ProductDecorator");

class GoldenItem extends ComponentDecorator {
  constructor(component) {
    super(component);
  }

  get itemName() {
    return `${this.component.itemName} (Golden Edition)`;
  }

  get itemCost() {
    return this.component.itemCost * 1.5; // Golden edition costs 50% more
  }

  showDetails() {
    console.log(`${this.itemName} is priced at $${this.itemCost}`);
  }
}

module.exports = GoldenItem;