var Customer = require("./Customer");

var base_prototype = new Customer();
base_prototype.addItemToList("product 1");
base_prototype.addItemToList("product 2");
base_prototype.addItemToList("product 3");
base_prototype.addItemToList("product 4");


module.exports = base_prototype;