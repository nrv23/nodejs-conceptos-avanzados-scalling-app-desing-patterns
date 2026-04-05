class Database {
  query(sql) {
    // Implementation for querying a real database
    // For demonstration, we'll just log the query
    console.log(`Executing query on real database: ${sql}`);
    // Return a promise or data as needed
    return Promise.resolve({ id: 1, name: "John Doe" });
  }
}

module.exports = Database;
