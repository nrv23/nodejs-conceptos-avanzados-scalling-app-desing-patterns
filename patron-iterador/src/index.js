const Product = require("./product");
const Iterator = require("./iterator");

const readline = require("readline");
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true); // Enable raw mode for detecting keypresses

// Display a message to prompt user for input
console.log("⬆️ ⬇️ ⬅️ ➡️ Press arrow keys to navigate. Press Ctrl+C to exit.");

// Inventory array with updated product names and prices
const products = new Iterator([
  new Product("Smartphone X", 999.99),
  new Product("Wireless Headphones", 199.99),
  new Product("Laptop Pro", 1499.99),
  new Product("Smartwatch", 299.99),
  new Product("Gaming Console", 499.99),
  new Product("Bluetooth Speaker", 149.99),
  new Product("4K Monitor", 349.99),
  new Product("Mechanical Keyboard", 129.99),
]);

products.current().writeLn();
// Event listener for keypress events
process.stdin.on("keypress", (char, key) => { // char es la tecla presionada, key es un objeto con información de la tecla
  // keypress es un evento para detctar cuando se presiona una tecla.
  // este codigo podria ser usado para crear un CLI personalizado
  // Clear the current line in the terminal
  process.stdout.clearLine();
  process.stdout.cursorTo(0);


  products.current().writeLn();

  // Handling different keypresses
  switch (key.name) {
    case "right":
      products.next().writeLn();
      break;
    case "left":
      products.prev().writeLn();
      break;
    case "up":
      products.first().writeLn();
      break;
    case "down":
      products.last().writeLn();
      break;

    case "c": // control + c
      if (key.ctrl) {
        console.log("👋 Exiting...");
        process.exit(); // Exit on Ctrl+C
      }
      break;
    default:
      console.log(`❓ Unknown key: ${key.name}`);
  }
});
