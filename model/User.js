"use strict";

const mongoose = require("mongoose"),
  bcrypt = require("bcrypt-nodejs");

const userSchema = mongoose.Schema({
  local: {
    email: String,
    password: String
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});

userSchema.methods.generateHash = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/**
 * Validation of Password
 * @param {string} password input from passport
 * Cant use arrow function since it doesn't have this binding
 */
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
