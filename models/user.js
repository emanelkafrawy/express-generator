var mongoose = require('mongoose');
var Schema =mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose'); //add username+password automaticlly

var User = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    admin:   {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);//use them +hashed password

module.exports = mongoose.model('User', User);


