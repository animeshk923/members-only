async function rootGet(req, res) {
  return res.render("index", { user: req.user });
}

async function signUpGet(req, res) {
  return res.render("sign-up-form");
}

async function signUpPost(req, res, next) {
  const { firstName, lastName, isAdmin } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await pool.query(
      "INSERT INTO users (first_name, last_name, isAdmin) VALUES ($1, $2, $3)",
      [firstName, lastName, isAdmin]
    );
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function logOutGet(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}
module.exports = {
  rootGet,
  signUpGet,
  signUpPost,
  logOutGet,
};
