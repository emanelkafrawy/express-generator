var express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('../models/user');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.findOne({username: req.body.username}) //check user exist or not
  .then((user) => { //user here means *the reslut*
    if(user !=null) {//user already exist
      var err = new Error('user ' + req.body.username + ' already exist');
      err.status = 403;
      next(err); 
    }
    else {
      return User.create({
        username: req.body.username,
        password: req.body.password});
    }
  })
  .then((user) => {
    res.statusCode = 200;
    res.setHeader('ContentType', 'application/json');
    res.json({status: 'Registration Successfull', user: user});
  }, (err) => next(err)/*if there is an error*/)
  .catch((err) => next());
});


router.post('/login', (req, res, next) => {
  
  if(!req.session.user) { //اليوزر مش عامل كوكي
    var authHeader = req.headers.authorization;

    if(!authHeader) { //null
      var err = new Error('you are not authonticated');
  
      res.setHeader('www-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
  
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  
    var username = auth[0];
    var password = auth[1];
  
    User.findOne({username: username})
    .then((user) => {
      if(user == null) {
        var err = new Error('user ' + username + " doesn't exist");
        res.setHeader('www-Authenticate', 'Basic');
        err.status = 403;
        return next(err);
      }
      else if (user.password !== password) {
        var err = new Error('password is not corrent');
        res.setHeader('www-Authenticate', 'Basic');
        err.status = 403;
        return next(err);
      }
      else if (user.username === username && user.password === password) {
        req.session.user = 'authenticated'; 
        res.statusCode = 200;
        res.setHeader('ContentType', 'text/plain');
        res.end('you are authenticated');
      } 
    })
    .catch((err) => next(err));
  } else {
    res.statusCode = 200;
    res.setHeader('ContentType', 'text/plain');
    res.end('you are already aunthenticated');
  }
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
