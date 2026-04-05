const AbstractDetails = require("./abstracDetails");

class ProductCategory extends AbstractDetails {

    constructor(categoryName) {
        super(); // Llamamos al constructor de la clase padre (AbstractDetails) para asegurarnos de que cualquier inicialización necesaria en la clase padre se realice correctamente.
        this.categoryName = categoryName;
        this.items = [];
    }

    get total() {
        // total es la suma de los precios de los productos en la categoría, inicia en 0 y se va sumando el precio de cada producto en la categoría
        // el segundo parametro es el valor inicial del total, en este caso es 0
        return +this.items
        .reduce((total, item) => total + (item.total ?? 0), 0);
    }

    printDetails() {
        console.log(`Category: ${this.categoryName}`);
        this.items.forEach((item) => item.printDetails());
    }

    addItem(item) {
        this.items.push(item);
    }
}

module.exports = ProductCategory;
