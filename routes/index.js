const { Router } = require("express");
const controller = require("../controllers/index");
const appRoute = Router();

appRoute.get("/", controller.rootGet);
appRoute.get("/sign-up", controller.signUpGet);
appRoute.post("/sign-up", controller.signUpPost);
appRoute.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);
appRoute.get("/log-out", controller.logOutGet);

module.exports = appRoute;
