'use strict'

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: String,
    created_at: { type: Date },
    updated_at: { type: Date },
    contact: String,
    phone: String,
    catogory: { type: mongoose.Schema.Types.ObjectId, ref: 'CompanyCatogory' },
});

mongoose.model('Company', schema);

module.exports = function (connection){
    return (connection || mongoose).model('Company');
};