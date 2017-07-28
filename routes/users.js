const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const remember_me = require('../config/tokens');

// Bring in User Models
let User = require('../models/user');

//Register Form
router.get('/register', function (req, res){
  res.render('register')
});


// Register Process
router.post('/register', function(req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Password do not match').equals(req.body.password);

    let errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        let newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
                if (err) {
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function (err) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        req.flash('success', 'You are now registered and can log in');
                        res.redirect('/users/login');
                    }
                })
            });
        })
    }
});
// Login Form
router.get('/login', function(req, res) {
  res.render('login');
});



// Login Process
router.post('/login',
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    function(req, res, next) {
        // Issue a remember me cookie if the option was checked
        if (!req.body.remember_me_checkbox) { return next(); }

        remember_me.issueToken(req.user, function(err, token) {
            if (err) { return next(err); }
            res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 });
            return next();
        });
    },
    function(req, res) {
        res.redirect('/');
});



// Logout
router.get('/logout', function(req, res) {
  res.clearCookie('remember_me');
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login')
})

module.exports = router;
