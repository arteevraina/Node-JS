const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    admin: {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);  //this will automatically add support for username and password

module.exports = mongoose.model("User", User);

