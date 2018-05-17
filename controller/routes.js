"use strict";

const express = require("express"),
  router = express.Router();

function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) return next();

  // if they aren't redirect them to the home page
  res.redirect("/");
}

module.exports = passport => {
  router.get("/", (req, res) => {
    res.render("index.ejs");
  });

  router.get("/login", (req, res) => {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  router.post(
    "/login", (req, res) => {
      let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      req.checkBody("email", "Email is invalid").matches(emailRegex);
      req.checkBody("password", "Password cannot be empty").notEmpty();

      let errors = req.validationErrors();

      if (errors) {
        res.render("login.ejs", { message: errors[0].msg });
      } else {
        passport.authenticate("login", {
          successRedirect: "/profile",
          failureRedirect: "/login",
          failureFlash: true
        })(req, res);
      }
    }
  );

  router.get("/signup", (req, res) => {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  router.post("/signup", (req, res) => {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    req.checkBody("email", "Email is invalid").matches(emailRegex);
    req.checkBody("password", "Password must be greater than 5 chars and must contain number").isLength({ min: 5 }).matches(/\d/);
    req.assert("confirm_password", "Passwords do not match").equals(req.body.password);
    let errors = req.validationErrors();

    if (errors) {
      res.render("signup.ejs", { message: errors[0].msg });
    } else {
      passport.authenticate("signup", {
        successRedirect: "/profile",
        failureRedirect: "/signup",
        failureFlash: true
      })(req, res);
    }
  });

  router.get("/auth/twitter", passport.authenticate("twitter"));
  router.get(
    "/auth/twitter/callback",
    passport.authenticate("twitter", {
      successRedirect: "/profile",
      failureRedirect: "/"
    })
  );

  router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "/profile",
      failureRedirect: "/"
    })
  );

  router.get("/profile", isLoggedIn, (req, res) => {
    res.render("prof.ejs", { user: req.user });
  });

  router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
  });

  return router;
};
