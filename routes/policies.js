var express = require('express');
var db = require('../utils/database.js').connection;
var Policy = require('../models/policy.js')(db);
var router = express.Router();
var Q = require('q');

router.post('/', function (req, res) {
  var data = req.body;
  Policy.find({ policy_no: data.policy_no }, function (err, policies) {
    if (policies.length > 0) {
      res.status(400).send('系统中已存在相同保单号的保单');
    } else {
      var policy = new Policy(data);
      policy.seller = req.user._id;
      policy.policy_status = '待支付';
      policy.save(function (err, policy, numAffected) {
        if (err) {
          res.status(500).json(err);
        } else {
          res.status(200).json({ message: '保单已成功添加' });
        }
      });
    }

  })
});

router.get('/', function (req, res) {
  var user = req.user;
  var query = {};
  if(user.role == '出单员'){
    query = {seller: user._id};
  }
  Policy.find(query)
     .populate('client seller')
     .exec()
     .then(function(policies){
       console.log("found!!!!!");
       console.log(policies);
       res.status(200).json(policies);
     },function(err){
       res.status(500).json(err);
     });
});

router.get('/to-be-paid', function (req, res) {
  var user = req.user;
  var query = {policy_status:'待支付'};
  if(user.role == '出单员'){
    query = {seller: user._id, policy_status:'待支付'};
  }else if(user.role == '客户'){
    query = {policy_status:'待支付'};
  }
  Policy.find(query)
     .populate('client seller')
     .exec()
     .then(function(policies){
       res.status(200).json(policies);
     },function(err){
       res.status(500).json(err);
     });
});

router.get('/paid', function (req, res) {
  var user = req.user;
  var query = {policy_status:'待支付'};
  if(user.role == '出单员'){
    query = {seller: user._id, policy_status:'待支付'};
  }else if(user.role == '客户'){
    query = {policy_status:'待支付'};
  }
  Policy.find(query)
     .populate('client seller')
     .exec()
     .then(function(policies){
       res.status(200).json(policies);
     },function(err){
       res.status(500).json(err);
     });
});

router.get('/:id', function (req, res) {
  Policy.findOne({_id: req.params.id})
    .populate('client seller')
    .exec()
    .then(function(policy){
       res.status(200).json(policy);
     },function(err){
       res.status(500).json(err);
     });
});

router.put('/:id', function (req, res) {
    Policy.findById(req.params.id, function (err, policy) {
        if (err)
            res.send(err);
        policy.policy_no = req.body.policy_no;
        policy.insu_company = req.body.insu_company;
        policy.plate_no = req.body.plate_no;
        policy.applicant = req.body.applicant;
        policy.frame_no = req.body.frame_no;
        policy.engine_no = req.body.engine_no;
        policy.mandatory_fee = req.body.mandatory_fee;
        policy.commercial_fee = req.body.commercial_fee;
        policy.tax_fee = req.body.tax_fee;
        policy.client = req.body.client;
        policy.seller = req.body.seller;
        policy.policy_status = req.body.policy_status;
        policy.paid_at = req.body.paid_at;
        policy.income = req.body.income;
        policy.payment = req.body.payment;
        policy.save(function (err) {
            if (err)
                res.send(err);

            res.json({message: '保单已成功更新'});
        });

    });
});

router.delete('/:id', function (req, res) {
  Policy.remove({_id: req.params.id}, function(err, policy){
    if (err)
      res.send(err);
    res.json({ message: '保单已成功删除' });
  });
});

module.exports = router;
