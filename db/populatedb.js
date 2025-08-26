require("dotenv").config();
const { Client } = require("pg");
const fs = require("fs");

const SQL = `
-- Users table

CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name VARCHAR (255),
  last_name VARCHAR (255),
  isAdmin BOOLEAN
);

-- Credentials table

CREATE TABLE IF NOT EXISTS credentials (
  user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email VARCHAR (255),
  password VARCHAR (255),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Messages table

CREATE TABLE IF NOT EXISTS messages (
  user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR (255),
  message VARCHAR (255),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Sessions table

CREATE TABLE sessions (
    sid VARCHAR(255) NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP(6) WITH TIME ZONE NOT NULL
);
`;

async function main() {
  console.log("seeding...");

  const client = new Client({
    // connectionString: process.argv[2], // pass your connection URI as a argument when running this script
    connectionString: `postgresql://${process.env.AIVEN_DB_USERNAME}:${process.env.AIVEN_DB_PASSWORD}@${process.env.AIVEN_DB_HOSTNAME}:${process.env.AIVEN_DB_PORT}/${process.env.AIVEN_DB}`,
    // connectionString: `postgresql://${process.env.LOCAL_DB_USERNAME}:${process.env.LOCAL_DB_PASSWORD}@${process.env.LOCAL_DB_HOSTNAME}:${process.env.LOCAL_DB_PORT}/${process.env.LOCAL_DB}`,
    // user: process.env.AIVEN_DB_USERNAME,
    // password: process.env.AIVEN_DB_PASSWORD,
    // host: process.env.AIVEN_DB_HOSTNAME,
    // port: process.env.AIVEN_DB_PORT,
    // database: process.env.AIVEN_DB,
    ssl: {
      rejectUnauthorized: true,
      ca: fs.readFileSync("./ca.pem").toString(),
    },
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
