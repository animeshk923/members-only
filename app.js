const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const { localStrategyConfig } = require("./auth/strategy");
const appRoute = require("./routes");
const {
  deserializerFunction,
  serializerFunction,
} = require("./auth/serialization");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));

app.use(passport.session());

passport.use(localStrategyConfig);

passport.serializeUser(serializerFunction);

passport.deserializeUser(deserializerFunction);

app.use("/", appRoute);

app.listen(3000, () => console.log("app listening on port 3000!"));
