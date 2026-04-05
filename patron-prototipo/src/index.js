
var base_prototype = require("./base_prototype");

var codelicks = base_prototype.clone();
codelicks.name = "Codelicks";
codelicks.addItemToList("product 5");

var john = base_prototype.clone();
john.name = "John";
john.addItemToList("product 6");

console.log(`${codelicks.name}: ${codelicks.cartItems}`);
console.log(`${john.name}: ${john.cartItems}`);
