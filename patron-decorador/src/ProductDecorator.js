const AbstractDecorator = require("./AbstractDecorator");


class ComponentDecorator extends AbstractDecorator {
  constructor(component) {
    super();
    this.component = component;
  }

  get itemName() {
    return this.component.itemName;
  }

  get itemCost() {
    return this.component.itemCost;
  }

  showDetails() {
    this.component.showDetails();
  }
}

module.exports = ComponentDecorator;