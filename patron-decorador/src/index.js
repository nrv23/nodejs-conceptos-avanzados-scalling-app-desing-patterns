const Customer = require("./Customer");
const Item = require("./Item");
const SilverItem = require("./SilverItem");
const GoldenItem = require("./GoldenItem");

const alice = new Customer("Alice", 2500);

const phonecase = new Item("Phone Laptop", 29.99);
const headphones = new Item("Bluetooth Headphones", 49.99);

const silverPhoneCase = new SilverItem(phonecase);
const goldenHeadphones = new GoldenItem(headphones);

console.log("Decorated items:");
silverPhoneCase.showDetails();
goldenHeadphones.showDetails();

alice.buy(goldenHeadphones);
alice.buy(silverPhoneCase);
alice.buy(phonecase); // Alice buys the original phone case without decoration

alice.displayStatus();
