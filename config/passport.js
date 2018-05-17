"use strict";

const LocalStrategy = require("passport-local").Strategy,
  TwitterStrategy = require("passport-twitter").Strategy,
  GoogleStrategy = require("passport-google-oauth20").Strategy,
  User = require("../model/User");

module.exports = (passport, config) => {
  /**
   * passport session setup
   * serialize is used
   */
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  /**
   * Signup strategy
   */
  passport.use(
    "signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      (req, email, password, done) => {
        /**
         * Async execution using Event loop
         */
        process.nextTick(() => {
          let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          User.findOne({ "local.email": email }, (err, user) => {
            if (err) return done(err);

            if (user)
              return done(
                null,
                false,
                req.flash("signupMessage", "This email is already taken.")
              );
            else {
              let newUser = new User();
              newUser.local.email = email;
              newUser.local.password = newUser.generateHash(password);

              newUser.save(err => {
                if (err) throw err;
                return done(null, newUser);
              });
            }
          });
        });
      }
    )
  );

  /**
   * Login strategy in passport
   */
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      (req, email, password, done) => {
        process.nextTick(() => {
          User.findOne({ "local.email": email }, (err, user) => {
            if (err) return done(err);

            if (!user)
              return done(
                null,
                false,
                req.flash("loginMessage", "No user found")
              );

            if (!user.validatePassword(password))
              return done(
                null,
                false,
                req.flash("loginMessage", "Oops! Wrong email or password.")
              );

            return done(null, user);
          });
        });
      }
    )
  );

  /**
   * passport strategy for twitter login
   */
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: config.twitterAuth.consumerKey,
        consumerSecret: config.twitterAuth.consumerSecret,
        callbackURL: config.twitterAuth.callbackURL
      },
      (token, tokenSecret, profile, done) => {
        process.nextTick(() => {
          User.findOne({ "twitter.id": profile.id }, (err, user) => {
            if (err) return done(err);
            if (user) return done(null, user);
            else {
              let newUser = new User();
              newUser.twitter.id = profile.id;
              newUser.twitter.token = token;
              newUser.twitter.username = profile.username;
              newUser.twitter.displayName = profile.displayName;

              newUser.save(err => {
                console.log(err);
              });
              return done(null, user);
            }
          });
        });
      }
    )
  );

  /**
   * passport strategy for google login
   */
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.googleAuth.clientID,
        clientSecret: config.googleAuth.clientSecret,
        callbackURL: config.googleAuth.callbackURL
      },
      (token, refreshToken, profile, done) => {
        process.nextTick(() => {
          User.findOne({ googleId: profile.id }, (err, user) => {
            if (err) return done(err);
            if (!user) {
              let newUser = new User();
              newUser.google.id = profile.id;
              newUser.google.token = token;
              newUser.google.name = profile.displayName;
              newUser.google.email = profile.emails[0].value;

              newUser.save(err => {
                if (err) console.log(err);
                return done(null, newUser);
              });
            } else {
              return done(null, user);
            }
          });
        });
      }
    )
  );
};
