var express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('../models/user');
var passport = require('passport');
const cors = require('./cors');

var authenticate = require('../authenticate');
var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/',cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
  User.find({}, (err,users) => {
    if(err) {
      return next(err);
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);//send it back to the server
    }
  })
});
/*
router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}),
    req.body.password, (err, user) => {
    if(err) {//user already exist
      res.statusCode = 500;
      res.setHeader('ContentType', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.boy.firstname) 
        user.firstname = req.body.firstname;
      if (req.boy.lastname) 
        user.lastname = req.body.lastname;
      user.save((err, user) => {
          if(err) {
            res.statusCode = 500;
              res.setHeader('ContentType', 'application/json');
              res.json({succes: true, status: 'Registration Successfull'});
              return ;
          }
            passport.authenticate('local')(req, res, () => {
              res.statusCode = 200;
              res.setHeader('ContentType', 'application/json');
              res.json({succes: true, status: 'Registration Successfull'});
            });
        });
    }
  });
});
*/
router.post('/signup',cors.corsWithOptions, (req, res,next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });
    }
  });
});

//login
router.post('/login',cors.corsWithOptions, passport.authenticate('local'), (req, res) => {

  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});


router.get('/logout',cors.corsWithOptions, (req, res) => {
  if (req.session) { //e=session exist
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('you are not logged in!');
    err.status = 403;
    next(err);
  }
});


module.exports = router;
