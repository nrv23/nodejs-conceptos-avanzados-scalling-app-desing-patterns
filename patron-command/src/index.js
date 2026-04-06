const invoker = require("./invoker.js");
const { Create, Exit } = require("./commands");

const readline = require("readline");

// Setting up the interface for reading from stdin and writing to stdout
const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Displaying available commands on startup
console.log("Commands: create <fileName> <text> | trace | undo | redo | exit");
terminal.prompt(); // Show prompt to accept input

// Event listener for handling the user's input
terminal.on("line", userInput => {
  // Split the input into command and arguments
  const [command, fileName, ...content] = userInput.split(" ");
  const fileContent = content.join(" "); // Rejoin content in case there are multiple words

  // Switch case to handle different commands based on user input
  switch (command) {
    case "exit":
      invoker.run(new Exit());
      terminal.close();
      break;

    case "create":
      if (!fileName) {
        console.log("⚠️ Please specify a file name!");
      } else {
        invoker.run(new Create(fileName, fileContent));
      }
      break;
    case "trace":
      invoker.printTrace();
      break;

    case "undo":
      invoker.undo();
      break;

    case "redo":
      invoker.redo();
      break;

    default:
      console.log(`❌ Command "${command}" not recognized!`);
  }

  // Show the prompt again after processing the command
  terminal.prompt();
});
