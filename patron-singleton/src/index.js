var Logger = require("./Logger");
var Customer = require("./Customer");
var Product = require("./Product");

Logger.log("starting app...");

var codelicks = new Customer("Codelicks", 600);
var book_product = new Product("Some books", [
  {
    item: "Book1",
    qty: 5,
    price: 200,
  },
  {
    item: "Book2",
    qty: 20,
    price: 39,
  },
]);

Logger.log("finished setup...");

console.log(`${Logger.count} total logs`);
Logger.logs.map((log) => console.log(`   ${log.message}`));
