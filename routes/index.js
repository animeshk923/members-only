const { Router } = require("express");
const controller = require("../controllers/index");
const appRoute = Router();
const passport = require("passport");
appRoute.get("/", controller.rootGet);
appRoute.get("/sign-up", controller.signUpGet);
appRoute.post("/sign-up", controller.validateUser, controller.signUpPost);
appRoute.get('/log-in', controller.logInGet)
appRoute.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);
appRoute.get("/log-out", controller.logOutGet);

module.exports = appRoute;
