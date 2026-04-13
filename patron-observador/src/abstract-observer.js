

class AbstractObserver {

    id;

    constructor(id) {
        this.id = id;
    }

    update(temperature) {
        throw new Error(`Implemente update method to ${temperature} argument`);
    }
}

module.exports = AbstractObserver;