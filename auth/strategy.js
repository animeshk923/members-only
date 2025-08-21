const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const db = require("../db/queries");

const localStrategyConfig = new LocalStrategy(async (email, password, done) => {
  try {
    // const { rows } = await pool.query(
    //   "SELECT * FROM users WHERE username = $1",
    //   [username]
    // );
    // rows[0]
    const emailQueryResult = await db.getUserCredentials(email);
    const user = emailQueryResult[0];

    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }

    const passwordQueryResult = db.getUserCredentials(email);
    const storedPass = passwordQueryResult[0].password;

    const match = await bcrypt.compare(password, storedPass);

    if (!match) {
      // passwords do not match!
      return done(null, false, { message: "Incorrect password" });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

module.exports = { localStrategyConfig };
