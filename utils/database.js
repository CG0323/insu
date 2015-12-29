'use strict'

var mongoose = require('mongoose');
var connection = mongoose.createConnection('mongodb://localhost/insu');
//mongoose.set('debug', true);

connection.on('error', function (err) {
    console.log(err);
});

exports.connection = connection;