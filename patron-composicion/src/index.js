const Product = require("./clasess/product");
const ProductCategory = require("./clasess/ProductCategory");

const booksCategory = new ProductCategory("Books");
const sportsCategory = new ProductCategory("Sports");

const someBook = new Product("Some book", 29.99);
const runningShoes = new Product("Nike Running Shoes", 79.99);

// Agregar productos a sus respectivas categorías
booksCategory.addItem(someBook);
sportsCategory.addItem(runningShoes);

console.log("Some Book total: ", `$${someBook.productPrice}`);

someBook.printDetails();
runningShoes.printDetails();

// 


booksCategory.printDetails();
sportsCategory.printDetails();

console.log("Books Category total: ", `$${booksCategory.total}`);
console.log("Sports Category total: ", `$${sportsCategory.total}`);