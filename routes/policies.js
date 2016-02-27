var express = require('express');
var db = require('../utils/database.js').connection;
var Policy = require('../models/policy.js')(db);
var router = express.Router();
var Q = require('q');
var logger = require('../utils/logger.js');
var Client = require('../models/client.js')(db);

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
          logger.error(err);
          res.status(500).send(err);
        } else {
          logger.info(req.user.name + " 提交了一份保单，保单号为："+ policy.policy_no +"。"+ req.clientIP);
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
  }else if(user.role=='客户'){
    var d = new Date();
    var end = new Date();
    d.setDate(d.getDate()-7);
    query = {client: user.client_id, created_at:{$gt: d, $lt: end}};  //暂时只获取近七天保单信息
  }
  Policy.find(query)
     .populate('client seller')
     .exec()
     .then(function(policies){
       res.status(200).json(policies);
     },function(err){
       logger.error(err);
       res.status(500).send(err);
     });
});

router.get('/to-be-paid', function (req, res) {
  var user = req.user;
  var query = {policy_status:'待支付'};
  if(user.role == '出单员'){
    query = {seller: user._id, policy_status:'待支付'};
  }
  Policy.find(query)
     .populate('client seller')
     .exec()
     .then(function(policies){
       res.status(200).json(policies);
     },function(err){
       logger.error(err);
       res.status(500).send(err);
     });
});

router.get('/paid', function (req, res) {
  var user = req.user;
  var query = {policy_status:'已支付'};
  if(user.role == '出单员'){
    query = {seller: user._id, policy_status:'已支付'};
  }
  Policy.find(query)
     .populate('client seller')
     .exec()
     .then(function(policies){
       res.status(200).json(policies);
     },function(err){
       logger.error(err);
       res.status(500).send(err);
     });
});

router.get('/:id', function (req, res) {
  Policy.findOne({_id: req.params.id})
    .populate('client')
    .populate({path:'seller',model:'User', populate:{path:'org', model:'Organization'}})
    .exec()
    .then(function(policy){
       res.status(200).json(policy);
     },function(err){
       logger.error(err);
       res.status(500).send(err);
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
        policy.mandatory_fee_income_rate = req.body.mandatory_fee_income_rate;
        policy.mandatory_fee_income = req.body.mandatory_fee_income;
        policy.mandatory_fee_payment_rate = req.body.mandatory_fee_payment_rate;
        policy.mandatory_fee_payment = req.body.mandatory_fee_payment;
        policy.commercial_fee = req.body.commercial_fee;
        policy.commercial_fee_income_rate = req.body.commercial_fee_income_rate;
        policy.commercial_fee_income = req.body.commercial_fee_income;
        policy.commercial_fee_payment_rate = req.body.commercial_fee_payment_rate;
        policy.commercial_fee_payment = req.body.commercial_fee_payment;
        policy.tax_fee = req.body.tax_fee;
        policy.tax_fee_income_rate = req.body.tax_fee_income_rate;
        policy.tax_fee_income = req.body.tax_fee_income;
        policy.tax_fee_payment_rate = req.body.tax_fee_payment_rate;
        policy.tax_fee_payment = req.body.tax_fee_payment;
        policy.client = req.body.client;
        policy.seller = req.body.seller;
        policy.policy_status = req.body.policy_status;
        policy.paid_at = req.body.paid_at;
        policy.total_income = req.body.total_income;
        policy.payment_addition = req.body.payment_addition;
        policy.payment_addition_comment = req.body.payment_addition_comment;
        policy.payment_substraction = req.body.payment_substraction;
        policy.payment_substraction_comment = req.body.payment_substraction_comment;
        policy.total_payment = req.body.total_payment;
        policy.effective_date = req.body.effective_date;
        policy.catogary = req.body.catogary;
        policy.payment_bank = req.body.payment_bank;
        policy.payment_proof = req.body.payment_proof;
        policy.save(function (err) {
            if (err){
              logger.error(err);
              res.send(err);
            }
            logger.info(req.user.name + " 更新了一份保单，保单号为："+ policy.policy_no +"。"+ req.clientIP);
            res.json({message: '保单已成功更新'});
        });

    });
});

router.delete('/:id', function (req, res) {
  Policy.remove({_id: req.params.id}, function(err, policy){
    if (err){
      logger.error(err);
      res.send(err);
    }
    logger.info(req.user.name + " 删除了一份保单。"+ req.clientIP);
    res.json({ message: '保单已成功删除' });
  });
});

router.post('/search', function (req, res) {
    var conditions = {};

    for (var key in req.body.filterByFields) {
        if (req.body.filterByFields.hasOwnProperty(key)) {
            conditions[key] = req.body.filterByFields[key];
        }
    }
    
    if(req.user.role == '出单员'){
       conditions['seller'] = req.user._id;
    }

    var sortParam ="";
    if(req.body.orderByReverse){
      sortParam = "-"+req.body.orderBy.toString();
    }else{
      sortParam = req.body.orderBy.toString();
    }
    var query = Policy.find(conditions);
    query
        .sort(sortParam)
        .skip(req.body.currentPage*req.body.pageSize)
        .limit(req.body.pageSize)
        .populate('client seller')
        .exec()
        .then(function(policies){
          Policy.count(conditions,function(err,c){
            if(err){
              logger.error(err);
              res.status(500).send("获取保单总数失败");
            }
          res.status(200).json({
            totalCount: c,
            policies:policies
        })});
        },function(err){
            logger.error(err);
        })
});


module.exports = router;
