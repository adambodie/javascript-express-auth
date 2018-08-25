const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});


// GET /logout
router.get('/logout', function(req, res, next) {
  if (req.session) {
    req.session.destroy(function(err){
      if(err) {
        return next(err);
      } else {
        return res.redirect('/')
      }
    })

  }
});


// GET /login
router.get('/login', function(req, res, next) {
  return res.render('login', { title: 'Log In' });
});


// POST /login
router.post('/login', function(req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function(error, user){
      if (error || !user) {
        const err = new Error('Wrong Email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    const err = new Error('Email and password are required.');
    err.status = 401;
    return next(err);
  }
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
            req.session.userId = user._id;
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

// GET /profile
router.get('/profile', function(req, res, next) {
  if (! req.session.userId ) {
    var err = new Error("You are not authorized to view this page.");
    err.status = 403;
    return next(err);
  }
  User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.render('profile', { title: 'Profile', name: user.name, dreamdestination: user.dreamdestination });
        }
      });
});


module.exports = router;
