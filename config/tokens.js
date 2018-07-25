const utils = require("./utils");
let User = require("../models/user");

let tokensConfig = {
  saveRememberMeToken: function(token, uid, fn) {
    User.findByIdAndUpdate(
      uid,
      { $set: { accessToken: token } },
      { new: true },
      function(err, user) {
        if (err) console.log(err);
      }
    );
    return fn();
  },

  issueToken: function(user, done) {
    let token = utils.randomString(64);
    this.saveRememberMeToken(token, user.id, err => {
      if (err) {
        return done(err);
      }
      return done(null, token);
    });
  },

  consumeRememberMeToken: function(token, fn) {
    let uid;
    // invalidate the single-use token
    // FIXME
    User.findOneAndUpdate(
      { accessToken: token },
      { $set: { accessToken: undefined } },
      { new: true },
      (err, user) => {
        uid = user._id;
      }
    );
    return fn(null, uid);
  }
};
module.exports = tokensConfig;
