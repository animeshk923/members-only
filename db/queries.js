const pool = require("./pool");

// READ Queries
async function getAllMessages() {
  const { rows } = await pool.query("SELECT * FROM messages;");
  return rows;
}

async function getUsername(id) {
  const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1;`, [id]);
  return rows;
}

async function getPassword(username) {}

// INSERT Queries
async function insertUserInfo(firstName, lastName, isAdmin) {
  await pool.query(
    "INSERT INTO users (first_name, last_name, isAdmin) VALUES ($1, $2, $3)",
    [firstName, lastName, isAdmin]
  );
}

async function insertUserCredentials(email, password) {
  await pool.query(
    "INSERT INTO credentials (email, password) VALUES ($1, $2)",
    [email, password]
  );
}

module.exports = {
  getAllMessages,
  getUsername,
  getPassword,
  insertUserInfo,
  insertUserCredentials,
};
