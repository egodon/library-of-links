const localStrategy = require("passport-local").Strategy;
const RememberMeStrategy = require("passport-remember-me").Strategy;
const User = require("../models/user");
const config = require("../config/database");
const bcrypt = require("bcryptjs");

const utils = require("./utils");
const remember_me = require("./tokens");

const passport = function(passport) {
  //Local Strategy
  passport.use(
    new localStrategy(function(username, password, done) {
      //Match Username
      let query = { username: username };
      User.findOne(query, function(err, user) {
        if (err) throw err;
        if (!user) {
          return done(null, false, { message: "No user found" });
        }

        // Match password
        bcrypt.compare(password, user.password, function(err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Wrong password" });
          }
        });
      });
    })
  );

  // Remember Me cookie strategy
  passport.use(
    new RememberMeStrategy(function(token, done) {
      remember_me.consumeRememberMeToken(token, function(err, uid) {
        if (err) {
          return done(err);
        }
        if (!uid) {
          return done(null, false);
        }

        User.findById(uid, function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        });
      });
    }, remember_me.issueToken)
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};

module.exports = passport;
