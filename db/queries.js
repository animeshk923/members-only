const pool = require("./pool");

async function getAllMessages() {
  const { rows } = await pool.query("SELECT * FROM messages;");
  return rows;
}

async function insertNewMessage(username, text) {
  await pool.query(
    `INSERT INTO messages (username, text, date) VALUES ($1, $2, CURRENT_TIMESTAMP);`,
    [username, text]
  );
}

async function getUsernameById(id) {
  const { rows } = await pool.query(
    "SELECT * FROM messages WHERE id = ($1);",
    [id]
  );
  return rows;
}

async function deleteAllData() {
  await pool.query("DROP TABLE messages");
}
module.exports = {
  getAllMessages,
  insertNewMessage,
  getUsernameById,
  deleteAllData,
};
