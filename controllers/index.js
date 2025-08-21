const { body, validationResult } = require("express-validator");

// Sign up validation
const alphaErr = "must only contain letters.";
const emailErr = "must be a valid email";
const passErr = "should be at least 6 characters";
const confirmPassErr = "passwords don't match. please re-enter";
const validateUser = [
  body("firstName").trim().isAlpha().withMessage(`First name ${alphaErr}`),
  body("lastName").trim().isAlpha().withMessage(`Last name ${alphaErr}`),
  body("email").trim().isEmail().withMessage(`${emailErr}`),
  body("password").trim().isLength({ min: 6 }).withMessage(passErr),
  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage(confirmPassErr),
];

async function rootGet(req, res) {
  res.render("index", { user: req.user });
}

async function signUpGet(req, res) {
  res.render("signup");
}

async function signUpPost(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("signup", {
      errors: errors.array(),
    });
  }

  const { firstName, lastName, isAdmin } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await pool.query(
      "INSERT INTO users (first_name, last_name, isAdmin) VALUES ($1, $2, $3)",
      [firstName, lastName, isAdmin]
    );
    res.redirect("/welcome");
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function logInGet(req, res) {
  res.render("login");
}

async function logOutGet(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

async function homepageGet(req, res, next) {
  res.render("home");
}
module.exports = {
  rootGet,
  signUpGet,
  signUpPost,
  logInGet,
  logOutGet,
  validateUser,
  homepageGet,
};
