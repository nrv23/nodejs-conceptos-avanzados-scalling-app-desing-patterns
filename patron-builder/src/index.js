const { PersonBuilder } = require("./PersonBuilder");


// Employees
var john = new PersonBuilder("John").makeEmployee().makeManager(30).build();
var jane = new PersonBuilder("Jane").makeEmployee().makeManager(20).build();
var bill = new PersonBuilder("Bill").build();

// Customers
var frank = new PersonBuilder("Frank").withFunds(500).withList(["shorts", "shoes", "s"]).build();
var ali = new PersonBuilder("Ali").withFunds(500).withList([]).build();


console.log({
    john,
    jane,
    bill,
    frank,
    ali
})