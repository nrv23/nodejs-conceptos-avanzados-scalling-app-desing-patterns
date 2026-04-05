class UserService {
  constructor(database) {
    this.database = database;
  }

  getUser(id) {
    return this.database.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

module.exports = UserService;
