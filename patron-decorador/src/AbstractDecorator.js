class AbstractDecorator {
  get itemName() {
    throw new Error('Getter itemName() must be implemented');
  }

  get itemCost() {
    throw new Error('Getter itemCost() must be implemented');
  }

  showDetails() {
    throw new Error('Method showDetails() must be implemented');
  }
}

module.exports = AbstractDecorator;