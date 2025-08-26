require("dotenv").config();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const db = require("../db/queries");

// Sign up validation
const alphaErr = "must only contain letters.";
const emailErr = "must be a valid email";
const passErr = "Password length should be at least 6 characters";
const confirmPassErr = "Passwords don't match. please re-enter";
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
  console.log("req.user: ", req.user);
  res.render("index", { user: req.user });
}

async function signUpGet(req, res) {
  res.render("signup");
}

async function signUpPost(req, res, next) {
  // validation check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("signup", {
      errors: errors.array(),
    });
  }

  const { firstName, lastName, email, adminPass } = req.body;
  let isAdmin = false;

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    if (adminPass === process.env.ADMIN_PASS) {
      isAdmin = true;
    } else {
      isAdmin = false;
    }

    await db.insertUserInfo(firstName, lastName, isAdmin);
    await db.insertUserCredentials(email, hashedPassword);

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function logInGet(req, res) {
  const errorMessage = req.session.messages;
  // if (!errors.isEmpty()) {
  //   return res.status(400).render("login", {
  //     errors: errors.array(),
  //   });
  // }
  console.log(errorMessage);
  console.log(typeof req.session.messages);

  res.render("login", { messages: errorMessage });
}

async function homepageGet(req, res) {
  const clubs = await db.getClubDetails();
  console.log("req.user:", req.user);
  console.log("req.user.email:", req.user.email);
  res.render("home", { clubList: clubs });
}

async function logOutGet(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

async function clubJoinGet(req, res) {
  const clubs = await db.getClubDetails();
  console.log(req.user.email);
  console.log("typeof:", typeof req.user.email);

  res.render("clubJoin", { clubList: clubs });
}

async function clubJoinPost(req, res) {
  const { clubId } = req.body;
  const userEmail = req.user.email;
  console.log("club id:", clubId);

  await db.insertClubMember(userEmail, clubId);

  res.redirect("home");
}

module.exports = {
  rootGet,
  signUpGet,
  signUpPost,
  logInGet,
  logOutGet,
  validateUser,
  homepageGet,
  clubJoinGet,
  clubJoinPost,
};
