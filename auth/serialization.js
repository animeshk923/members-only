const serializerFunction = async function (user, done) {
  done(null, user.id);
};

const deserializerFunction = async function (id, done) {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
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
