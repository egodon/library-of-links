const express = require('express');
const router = express.Router();
const moment = require('moment');

// Link Model
let Link = require('../models/link');

// User Model
let User = require('../models/user');


// Add Route
router.get('/add', ensureAnthenticated, (req, res) => {
  res.render('add_link', {
    title: 'Add Link'
  });
});


// Update Submit POST Route
router.post('/edit/:id', ensureAnthenticated, function(req, res) {
    let link = {};
    link.title = req.body.title;
    link.submitter = req.body.submitter;
    link.body = req.body.body;

    let query = {_id:req.params.id}

    Link.update(query, link, (err) => {
        if (err) {
          console.log(err);
          return;
        } else {
          req.flash('success', 'Link Updated')
          res.redirect('/');
        }
    });
});


// Add Submit POST Route
router.post('/add', function(req, res) {
  req.checkBody('title', 'Title is required').notEmpty();

  req.checkBody('url', 'URL is required').notEmpty();

  // Get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_article', {
    title: 'Add Link',
    errors: errors
    })
  }else {
    let link = new Link();
    link.title = req.body.title;
    link.submitter = req.user.name;
    link.url = req.body.url;
    link.submissionDate = moment().format("MMMM Do, YYYY");
    link.category = req.body.category;

    link.save((err) => {
        if (err) {
          console.log(err);
          return;
        } else {
          req.flash('success', 'Link Added')
          res.redirect('/');
        }
    });
  }

});

// Get Single Link
router.get('/:id', function(req, res) {
  Link.findById(req.params.id, function(err, article) {
      User.findById(article.submitter, function (err, user) {
          res.render('link', {
            link: article,
            submitter: user.name
          });
      })

  });
});

// Delete Link
router.delete('/:id', function(req, res) {
  if (!req.user._id){
    res.status(401).send();
  }
  let query = {_id: req.params.id}

  Link.findById(req.params.id, function(err, article){
    if (article.submitter != req.user._id){
      res.status(401).send();
    }else {
      Link.remove(query, function(err) {
        if (err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

// Load Edit Form
router.get('/edit/:id', function(req, res) {
  Link.findById(req.params.id, function(err, links) {
      if(links.submitter != req.user._id){
        req.flash('danger', 'Not Authorized');
        res.redirect('/');
      }
      res.render('edit_link', {
        title: 'Edit Link',
        link:links
      });
  });
});

// Access Control
function ensureAnthenticated(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login')
  }
}

module.exports = router;
