var mongoose = require('mongoose');
var Schema =mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose'); //add username+password automaticlly

var User = new Schema({
    admin: {
        type: Boolean,
        default: false
    }

});

User.plugin(passportLocalMongoose);//use them +hashed password

module.exports = mongoose.model('User', User);


