function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.render("login", { messages: "not authorized to this route" });
  }
}

function isAdmin(req, res, next) {}

module.exports = {
  isAuth,
  isAdmin,
};
