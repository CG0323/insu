'use strict'

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  policy_no: { type: String, index: true, unique: true },
  insu_company: String,
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  plate_province: String,
  plate_no: String,
  effective_date: {type: Date},
  applicant: { name: String, phone: String, identity: String, address: String },
  frame_no: String,
  engine_no: String,
  payment_proof: String,
  mandatory_fee: Number,
  mandatory_fee_income_rate: Number,
  mandatory_fee_income: Number,
  mandatory_fee_payment_rate: Number,
  mandatory_fee_payment: Number,
  commercial_fee: Number,
  commercial_fee_income_rate: Number,
  commercial_fee_income: Number,
  commercial_fee_payment_rate: Number,
  commercial_fee_payment: Number,
  tax_fee: Number,
  tax_fee_income_rate: Number,
  tax_fee_income: Number,
  tax_fee_payment_rate: Number,
  tax_fee_payment: Number,
  catogary: String,
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  policy_status: String,
  created_at: { type: Date },
  updated_at: { type: Date },
  paid_at: {type: Date},
  total_income: Number,
  payment_addition: Number,
  payment_substraction: Number,
  payment_addition_comment: String,
  payment_substraction_comment: String,
  total_payment: Number,
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


