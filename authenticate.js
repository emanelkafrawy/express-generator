var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config.js');
exports.local = passport.use(new localStrategy(User.authenticate())); //provide auth for local strategy
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, 
        {expiresIn: 3600}); //how long the jsonwebtoken will be expire after
};

exports.verifyUser = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                var err = new Error('You are not authenticated!');
                err.status = 401;
                return next(err);
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        var err = new Error('No token provided!');
        err.status = 403;
        return next(err);
    }
};

exports.verifyAdmin = function(req,res,next) {
    if(req.user.admin == true) {
        next();
    }
    else {
        err = new Error('you are not authorized to perform this operation');
        err.status = 403; //not found
        return next(err);
    }
}



//opts = otions 
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

opts.secretOrKey = config.secretKey; //[يحددلي هستخدم انهي كي عشان اعمل sign in]

//hson webtoken strategy
exports.jwtPassport = passport.use(new JwtStrategy(opts , 
    (jwt_payload, done) => {
        console.log("Jwt payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if(err) {
                return done(err, false);//callback that passport into your strategy .
            }
            else if (user) {
                return done(null, user);//there is no error , not null
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session:false});//verify incoming user +will not create session in this case

