"use strict";

const express = require("express"),
  app = express(),
  port = process.env.PORT || 8080,
  mongoose = require("mongoose"),
  passport = require("passport"),
  flash = require("connect-flash"),
  morgan = require("morgan"),
  cookieParser = require("cookie-parser"),
  bodyParser = require("body-parser"),
  validator = require("express-validator"),
  session = require("express-session");

const config = require("./config/config");

mongoose.connect(config.url);
require("./config/passport")(passport, config); // pass passport for configuration

// set up our express application
if (process.env.NODE_ENV === "DEVELOPMENT") app.use(morgan("dev")); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validator());

app.set("view engine", "ejs"); // set up ejs for templating

// required for passport
app.use(
  session({
    secret: "hemantjoshiisadeveloper",
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

var routes = require("./controller/routes")(passport);
app.use("/", routes);

module.exports = app;
