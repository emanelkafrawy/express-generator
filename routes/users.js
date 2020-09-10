var express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('../models/user');
var passport = require('passport');

var authenticate = require('../authenticate');
var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}),
    req.body.password, (err, user) => {
    if(err) {//user already exist
      res.statusCode = 200;
      res.setHeader('ContentType', 'application/json');
      res.json({err: err});
    }
    else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('ContentType', 'application/json');
        res.json({succes: true, status: 'Registration Successfull'});
      });
    }
  })

});

//login
router.post('/login', passport.authenticate('local'), (req, res) => {

  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
        res.setHeader('ContentType', 'application/json');
        res.json({succes: true,token: token, status: 'you are login Successfull !'});
});

router.get('/logout', (req, res) => {
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
