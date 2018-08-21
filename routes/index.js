const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /register
router.get('/register', function(req, res, next) {
  return res.render('register', { title: 'Sign Up' });
});

// GET /register
router.post('/register', function(req, res, next) {
  if (req.body.email &&
    req.body.name &&
    req.body.dreamdestination &&
    req.body.password &&
    req.body.confirmPassword) {
      // check to see if passwords match
      if (req.body.password !== req.body.confirmPassword) {
        const err = new Error('Passwords do not Match');
        err.status = 400;
        return next(err);
      }

      // create object with form input
        const userData = {
          email: req.body.email,
          name: req.body.name,
          dreamdestination: req.body.dreamdestination,
          password: req.body.password,
        }
        // use schema's `create` method to insert data into mongo
        User.create(userData, function(error, user) {
          if (error) {
            return next(error);
          } else {
            return res.redirect('/profile')
          }
        });

    } else {
      const err = new Error('All Fields Required');
      err.status = 400;
      return next(err);
    }
});


// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

module.exports = router;
