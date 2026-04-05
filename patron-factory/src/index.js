const PersonFactory = require("./PersonFactory");

var codelicks = PersonFactory("Codelicks", 500,"admin","customer");

codelicks.funds = 1000;
var john = PersonFactory("John", 900, "Something","employee");

john.payDay(100);

console.log(codelicks.toString());
console.log(john.toString());
