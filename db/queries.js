const pool = require("./pool");

// READ Queries

async function getUserCredentials(email) {
  const { rows } = await pool.query(
    `SELECT * FROM credentials WHERE email = $1;`,
    [email]
  );
  return rows;
}

// INSERT Queries
async function insertUserInfo(firstName, lastName, isAdmin) {
  await pool.query(
    "INSERT INTO users (first_name, last_name, isadmin) VALUES ($1, $2, $3)",
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
  getUserCredentials,
  insertUserInfo,
  insertUserCredentials,
};
