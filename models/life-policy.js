'use strict'

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  policy_no: { type: String, index: true, unique: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  applicant: {name: String, benefit_name: String, phone: String, identity: String},
  payment_bank: String,
  payment_proof: String,

  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization'},
  stage: String,
  policy_name: String,
  fee: Number,
  policy_status: String,
  created_at: { type: Date },
  updated_at: { type: Date },
  paid_at: {type: Date},
  income_rate : Number,
  income: Number,
  income_addition_rate: Number,
  income_addition: Number,
  income_addition_comment: String,
  income_total : Number,
  payment_rate : Number,
  payment: Number,
//   payment_substraction_rate: Number,
//   payment_substraction: Number,
//   payment_substraction_comment: String,
  payment_addition_rate: Number,
  payment_addition: Number,
  payment_addition_comment: String,

  payment_total: Number,
  profit: Number
});

schema.pre('save', function(next){
   var now = new Date();
   this.updated_at = now;
   if ( !this.created_at ) {
     this.created_at = now;
   }
  next();
});

mongoose.model('LifePolicy', schema);

module.exports = function (connection){
    return (connection || mongoose).model('LifePolicy');
};


