const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const mid = require('../middleware');

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


// GET /visit
router.get('/visit', function(req, res, next) {
  return res.render('visit', { title: 'Visit' });
});

// GET /login
router.get('/login', mid.loggedOut, function(req, res, next) {
  return res.render('login', { title: 'Log In' });
});

router.get('/login/facebook',
  passport.authenticate('facebook'));

router.get('/login/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
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
router.get('/register', mid.loggedOut, function(req, res, next) {
  return res.render('register', { title: 'Sign Up' });
});

// GET /register
router.post('/register', function(req, res, next) {
  const pattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (req.body.email &&
    req.body.name &&
    req.body.dreamdestination &&
    req.body.password &&
    req.body.confirmPassword) {
      // check to see if password matches pattern
      if (!pattern.test(req.body.password)) {
        const err = new Error('Password must have at least 1 uppercase letter, 1 lowercase letter, 1 digit and have at least 8 characters.');
        err.status = 400;
        return next(err);
      }      

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
router.get('/profile', mid.requiresLogin, function(req, res, next) {
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
