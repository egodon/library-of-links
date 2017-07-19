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
    link.url = req.body.url;
    link.category = req.body.category;

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
    res.render('add_link', {
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

// Get links by category
router.get('/:category', (req, res) => {
    let category = req.params.category;

    Link.find({'category': category}).sort({_id: -1}).exec((err, links) => {
        if (err){
            console.log(err)
        } else {
            res.render('index', {
                title: 'LINK LIBRARY',
                links: links
            });
        }
    });
});

// Delete Link
router.delete('/:id', function(req, res) {
  if (!req.user._id){
    res.status(401).send();
  }
  let query = {_id: req.params.id}

  Link.findById(req.params.id, function(err, link){
    if (link.submitter != req.user._id){
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
  Link.findById(req.params.id, function(err, link) {
      if(link.submitter != req.user.name){
        req.flash('danger', 'Not Authorized');
        res.redirect('/');
      }
      res.render('edit_link', {
        title: 'Edit Link',
        link:link
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
