'use strict'

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: String,
    type: String,
    identity: String,
    payee: String,
	bank: String,
	account: String
});

mongoose.model('Client', schema);

module.exports = function (connection){
    return (connection || mongoose).model('Client');
};