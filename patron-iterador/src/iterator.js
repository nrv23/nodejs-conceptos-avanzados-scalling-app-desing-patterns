

class Iterator {
    #array;
    #index;
    constructor(array) {
        if (!Array.isArray(array)) throw new Error("The constructor value is not an array");
        if (array.length === 0) throw new Error("The array argument is empty");
        this.#array = array;
        this.#index = 0;
    }

    // -------------------------------- Metodos privados para manipular el array ----------------
    #hasNext() {
        if (this.#index >= (this.#array.length - 1)) return null;

        this.#index++;
        return true;
    }

    #hasPrev() {
        if (this.#index <= 0) return null;
        this.#index--;
        return true;
    }

    // --------------------------------------------------------

    first() {
        this.#index = 0;
        return this.#array[this.#index];
    }

    last() {
        this.#index = this.#array.length - 1;
        return this.#array[this.#index];
    }

    next() {

        if (this.#hasNext()) return this.#array[this.#index];
        return this.first();
    }

    prev() {

        if (this.#hasPrev()) return this.#array[this.#index];
        return this.last();
    }
    current() {
        return this.#array[this.#index];
    }
};


module.exports = Iterator;