'use strict'

var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var schema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    role: String,
    organization: String,
    client_id: mongoose.Schema.Types.ObjectId
});

schema.plugin(passportLocalMongoose);

mongoose.model('User', schema);

module.exports = function (connection){
    return (connection || mongoose).model('User');
};