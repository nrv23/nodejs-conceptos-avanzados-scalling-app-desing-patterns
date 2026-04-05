const Database = require("./database");
const UserService = require("./UserService");

const userService = new UserService(new Database());
userService.getUser(1).then((user) => {
  console.log("User:", user);
});
