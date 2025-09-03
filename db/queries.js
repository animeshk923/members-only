const pool = require("./pool");

// READ Queries

async function getUserCredentials(email) {
  const { rows } = await pool.query(
    `SELECT * FROM credentials WHERE email = $1;`,
    [email]
  );
  return rows;
}

async function getAllClubDetails() {
  const { rows } = await pool.query(`SELECT * FROM clubs;`);
  return rows;
}

async function getClubIdByName(clubName) {
  const { rows } = await pool.query(
    `SELECT * FROM clubs WHERE club_name = $1;`,
    [clubName]
  );
  return rows[0].club_id;
}

async function getClubNameByUserEmail(clubId) {
  const { rows } = await pool.query(
    `SELECT
  c.club_name AS name
  FROM
    clubs AS c
    INNER JOIN club_members AS cm ON c.club_id = cm.club_id
  WHERE
    c.club_id = $1;`,
    [clubId]
  );
  return rows;
}

async function UserIsClubMember(email) {
  const { rows } = await pool.query(
    `SELECT * from club_members WHERE members = $1`,
    [email]
  );
  if (rows.length > 0) {
    return true;
  } else {
    return false;
  }
}

async function getAllMessages() {
  const { rows } = await pool.query(`SELECT * from messages;`);
  return rows;
}

async function getAuthorByMessage(userId) {
  const { rows } = await pool.query(
    `
    SELECT
      u.first_name,
      u.last_name
    FROM
      users AS u
      INNER JOIN messages AS m ON u.user_id = m.user_id
    WHERE
      m.user_id = $1;`,
    [userId]
  );
  return rows;
}

// INSERT Queries

async function insertUserInfo(firstName, lastName, isAdmin) {
  await pool.query(
    `INSERT INTO users (first_name, last_name, isadmin) VALUES ($1, $2, $3)`,
    [firstName, lastName, isAdmin]
  );
}

async function insertUserCredentials(email, password) {
  await pool.query(
    `INSERT INTO credentials (email, password) VALUES ($1, $2)`,
    [email, password]
  );
}

async function insertClubMember(email, clubId) {
  await pool.query(
    `INSERT INTO club_members (club_id, members) VALUES ($1, $2)`,
    [clubId, email]
  );
}

async function insertMessage(userId, title, message, author) {
  await pool.query(
    `INSERT INTO messages (user_id, title, message, date, author) VALUES ($1, $2, $3, CURRENT_DATE, $4)`,
    [userId, title, message, author]
  );
}

module.exports = {
  getUserCredentials,
  getAllClubDetails,
  getClubNameByUserEmail,
  getClubIdByName,
  getAllMessages,
  getAuthorByMessage,
  insertUserInfo,
  insertUserCredentials,
  insertClubMember,
  insertMessage,
  UserIsClubMember,
};
