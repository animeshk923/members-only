const serializerFunction = async function (user, done) {
  done(null, user.email);
};

const deserializerFunction = async function (email, done) {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
};

module.exports = {
  serializerFunction,
  deserializerFunction,
};
