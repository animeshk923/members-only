function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.render("partials/errors", { messages: "not authorized to this route" });
  }
}

function isAdmin(req, res, next) {}

function isLoggedIn(req, res, next) {
  // implement later; to check whether user is already logged in, if yes, redirect to home page, if not, then display the login page
  // if (!req.user) {
  //   next();
  // } else {
  //   res.render("/home", { messages: "already logged in" });
  // }
}

function isClubMember(req, res, next) {} // implement later

const club1 = 1234;
const club2 = 4321;
const club3 = 1221;
const club4 = 1212;
module.exports = {
  isAuth,
  isAdmin,
  isLoggedIn,
  isClubMember,
  club1,
  club2,
  club3,
  club4,
};
