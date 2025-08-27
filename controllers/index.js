require("dotenv").config();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const db = require("../db/queries");
const { club1, club2, club3, club4 } = require("../auth/authMiddleware");

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
  res.render("login", { messages: errorMessage });
}

async function homepageGet(req, res) {
  const clubs = await db.getAllClubDetails();
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
  const clubs = await db.getAllClubDetails();

  res.render("clubJoin", { clubList: clubs });
}

async function clubJoinPost(req, res) {
  const { clubName, passcode } = req.body;
  const userEmail = req.user.email;
  const clubId = await db.getClubIdByName(clubName);

  switch (clubId) {
    case 1:
      if (Number(passcode) !== club1) {
        res.render("partials/errors", {
          messages:
            "wrong password, try again (TIP: password is in codebase somewhere)",
        });
      } else {
        await db.insertClubMember(userEmail, clubId);
        res.redirect("home");
      }
      break;

    case 2:
      if (Number(passcode) !== club2) {
        res.render("partials/errors", {
          messages:
            "wrong password, try again (TIP: password is in codebase somewhere",
        });
      } else {
        await db.insertClubMember(userEmail, clubId);
        res.redirect("home");
      }
      break;

    case 3:
      if (Number(passcode) !== club3) {
        res.render("partials/errors", {
          messages:
            "wrong password, try again (TIP: password is in codebase somewhere",
        });
      } else {
        await db.insertClubMember(userEmail, clubId);
        res.redirect("home");
      }
      break;

    case 4:
      if (Number(passcode) !== club4) {
        res.render("partials/errors", {
          messages:
            "wrong password, try again (TIP: password is in codebase somewhere",
        });
      } else {
        await db.insertClubMember(userEmail, clubId);
        res.redirect("home");
      }
      break;

    default:
      res.render("partials/errors", { messages: "club joining failed" });
      break;
  }
}

async function messageFormGet(req, res) {
  res.render("newMessage");
}

async function messageFormPost(req, res) {
  res.render("newMessage");
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
  messageFormGet,
  messageFormPost,
};
