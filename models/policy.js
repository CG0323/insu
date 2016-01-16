'use strict'

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    policy_no: {type: String, index: true, unique: true},
    insu_company: String,
    plate_no: String,
    applicant: {name: String, phone: String, identity: String, address: String},
	frame_no: String,
	engine_no: String,
	insu_fee: Number,
	client: {type:mongoose.Schema.Types.ObjectId, ref:'Client'},
    seller: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    policy_status: String,
    created_at : { type: Date },
    updated_at : { type: Date }
});

schema.pre('save', function(next){
  var now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

mongoose.model('Policy', schema);

module.exports = function (connection){
    return (connection || mongoose).model('Policy');
};


