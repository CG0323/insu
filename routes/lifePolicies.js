var express = require('express');
var db = require('../utils/database.js').connection;
var Policy = require('../models/life-policy.js')(db);
var router = express.Router();
var Q = require('q');
var logger = require('../utils/logger.js');
var Client = require('../models/client.js')(db);
var iconv = require('iconv-lite');

router.post('/', function (req, res) {
  var data = req.body;
  Policy.find({ policy_no: data.policy_no }, function (err, policies) {
    if (policies.length > 0) {
      res.status(400).send('系统中已存在相同保单号的保单');
    } else {
      var policy = new Policy(data);
      policy.seller = req.user._id;
      policy.organization = req.user.org;
      policy.policy_status = '待支付';
      policy.save(function (err, policy, numAffected) {
        if (err) {
          logger.error(err);
          res.status(500).send(err);
        } else {
          logger.info(req.user.name + " 提交了一份寿险保单，保单号为："+ policy.policy_no +"。"+ req.clientIP);
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
     .populate('client seller organization')
     .exec()
     .then(function(policies){
       res.status(200).json(policies);
     },function(err){
       logger.error(err);
       res.status(500).send(err);
     });
});


router.get('/upgrade', function (req, res) {
    console.log("upgrading in progress");
    var query = Policy.find({policy_status:'已支付'});
    query
        .populate('seller')
        .exec()
        .then(function(policies){
          // console.log(policies);
          for(var i =0; i < policies.length; i++)
          {
            var policy = policies[i];
            console.log(policy);
            policy.organization = policy.seller.org;
            // console.log(policy.organization);
            policy.save();
          }
          
        });
});

router.post('/excel', function (req, res) {
    var conditions = {};
    for (var key in req.body.filterByFields) {
        if (req.body.filterByFields.hasOwnProperty(key) && req.body.filterByFields[key] != null && req.body.filterByFields[key] != "") {
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
    if(req.body.fromDate != undefined && req.body.toDate != undefined){
        conditions['created_at']={$gte:req.body.fromDate, $lte:req.body.toDate};
    }else if(req.body.fromDate != undefined ){
        conditions['created_at']={$gte:req.body.fromDate};
    }else if(req.body.toDate != undefined ){
        conditions['created_at']={$lte:req.body.toDate};
    }
    var query = Policy.find(conditions);
    query
        .sort(sortParam)
        .populate('client seller organization company')
        .exec()
        .then(function(policies){
            var json2csv = require('json2csv');
            var fields = [
                'created_at',
                'policy_no',
                'company.name',
                'applicant.name',
                'applicant.benefit_name',
                'applicant.phone',
                'applicant.identity',
                'organization.name',
                'seller.name',
                'client.name',
                'stage',
                'policy_name',
                'fee',
                'income_rate',
                'income',
                'income_addition_rate',
                'income_addition',
                'income_total',
                'payment_rate',
                'payment',
                'payment_addition_rate',
                'payment_addition',
                // 'payment_substraction_rate',
                // 'payment_substraction',
                'payment_total',
                'profit',
                'policy_status',
                'paid_at',
                'payment_bank'
            ];
            var fieldNames = [
                '提交日期',
                '保单号',
                '保险公司',
                '投保人',
                '被保险人',
                '电话',
                '身份证号',
                '营业部',
                '出单员',
                '业务渠道',
                '期数',
                '险种名称',
                '保费',
                '跟单费比例',
                '跟单费',
                '跟单费奖励比例',
                '跟单费奖励',
                '收入小计',
                '结算费比例',
                '结算费',
                '其他费用比例',
                '其他费用',
                // '结算费减项比例',
                // '结算费减项',
                '支出小计',
                '总毛利润',
                '保单状态',
                '支付日期',
                '支付银行'
            ];

            var dateFormat = require('dateformat');
            var arr = [];

            for (var i = 0; i < policies.length; i++) {
                var policy = policies[i];
                var row = {};
                row.company = {};
                row.applicant = {};
                row.organization = {};
                row.seller = {};
                row.client = {};
                row.created_at = (dateFormat(policy.created_at, "mm/dd/yyyy"));
                row.policy_no = 　"'" + policy.policy_no;
                row.company.name = policy.company.name;
                row.applicant.name = policy.applicant.name;
                row.applicant.benefit_name = policy.applicant.benefit_name;
                row.applicant.phone = "'" + policy.applicant.phone;
                row.applicant.identity = "'" + policy.applicant.identity;
                row.organization.name = policy.organization.name;
                row.seller.name = policy.seller.name;
                row.client.name = policy.client? policy.client.name : '';
                row.stage = policy.stage;
                row.policy_name = policy.policy_name;
                row.fee = policy.fee;
                row.income_rate = policy.income_rate+"%";
                row.income = policy.income;
                row.income_addition_rate = policy.income_addition_rate+"%";
                row.income_addition = policy.income_addition;
                row.income_total = policy.income_total;
                row.payment_rate = policy.payment_rate+"%";
                row.payment = policy.payment;
                row.payment_addition_rate = policy.payment_addition_rate+"%";
                row.payment_addition = policy.payment_addition;
                // row.payment_substraction_rate = policy.payment_substraction_rate+"%";
                // row.payment_substraction = policy.payment_substraction;
                row.payment_total = policy.payment_total;
                row.profit = policy.profit;
                
                row.policy_status = policy.policy_status;
                row.paid_at= policy.paid_at ? (dateFormat(policy.paid_at, "mm/dd/yyyy")) : '';
                row.payment_bank =policy.payment_bank ? policy.payment_bank : '';
                arr.push(row);
            }
            json2csv({ data: arr, fields: fields, fieldNames: fieldNames }, function (err, csv) {
                if (err) console.log(err);

                var dataBuffer = Buffer.concat([new Buffer('\xEF\xBB\xBF', 'binary'), new Buffer(csv)]);
                res.setHeader('Content-Type', 'text/csv;charset=utf-8');
                res.setHeader("Content-Disposition", "attachment;filename=" + "life.csv");
                res.send(dataBuffer);
            });
        },function(err){
            logger.error(err);
        })
});

router.get('/to-be-paid', function (req, res) {
  var user = req.user;
  var query = {policy_status:'待支付'};
  if(user.role == '出单员'){
    query = {seller: user._id, policy_status:'待支付'};
  }
  Policy.find(query)
     .populate('client seller organization')
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
     .populate('client seller organization')
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
    .populate('client organization')
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
        policy.applicant = req.body.applicant;
        policy.stage = req.body.stage;
        policy.policy_name = req.body.policy_name;
        policy.fee = req.body.fee;
        policy.income_rate = req.body.income_rate;
        policy.income = req.body.income;
        policy.income_addition_rate = req.body.income_addition_rate;
        policy.income_addition = req.body.income_addition;
        policy.income_addition_comment = req.body.income_addition_comment;
        policy.income_total = req.body.income_total;
        policy.payment_rate = req.body.payment_rate;
        policy.payment = req.body.payment;
        policy.payment_addition_rate = req.body.payment_addition_rate;
        policy.payment_addition = req.body.payment_addition;
        policy.payment_addition_comment = req.body.payment_addition_comment;
        policy.payment_total = req.body.payment_total;
        policy.profit = req.body.profit;        
        policy.client = req.body.client;
        policy.seller = req.body.seller;
        policy.policy_status = req.body.policy_status;
        policy.paid_at = req.body.paid_at;     
        policy.payment_bank = req.body.payment_bank;
        policy.payment_proof = req.body.payment_proof;
        policy.company = req.body.company;
        policy.organization = req.body.organization;
        policy.save(function (err) {
            if (err){
              logger.error(err);
              res.send(err);
            }
            logger.info(req.user.name + " 更新了一份寿险保单，保单号为："+ policy.policy_no +"。"+ req.clientIP);
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
    logger.info(req.user.name + " 删除了一份寿险保单。"+ req.clientIP);
    res.json({ message: '保单已成功删除' });
  });
});

router.post('/search', function (req, res) {
    var conditions = {};

    for (var key in req.body.filterByFields) {
        if (req.body.filterByFields.hasOwnProperty(key) && req.body.filterByFields[key] != null && req.body.filterByFields[key] != "") {
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
    
    if(req.body.fromDate != undefined && req.body.toDate != undefined){
        conditions['created_at']={$gte:req.body.fromDate, $lte:req.body.toDate};
    }else if(req.body.fromDate != undefined ){
        conditions['created_at']={$gte:req.body.fromDate};
    }else if(req.body.toDate != undefined ){
        conditions['created_at']={$lte:req.body.toDate};
    }
    
    var query = Policy.find(conditions);
    query
        .sort(sortParam)
        .skip(req.body.currentPage*req.body.pageSize)
        .limit(req.body.pageSize)
        .populate('client seller organization')
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

router.post('/summary', function (req, res) {
    var conditions = {};

    for (var key in req.body.filterByFields) {
        if (req.body.filterByFields.hasOwnProperty(key) && req.body.filterByFields[key] != null && req.body.filterByFields[key] != "") {
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
    
    if(req.body.fromDate != undefined && req.body.toDate != undefined){
        conditions['created_at']={$gte:req.body.fromDate, $lte:req.body.toDate};
    }else if(req.body.fromDate != undefined ){
        conditions['created_at']={$gte:req.body.fromDate};
    }else if(req.body.toDate != undefined ){
        conditions['created_at']={$lte:req.body.toDate};
    }
    
    var query = Policy.find(conditions);
    query
        .exec()
        .then(function(policies){
            var totalIncome = 0;
            var totalPayment = 0;
            for(var i = 0; i < policies.length; i++){
              totalIncome += policies[i].income_total;  
              totalPayment += policies[i].payment_total;
            };
          res.status(200).json({
            total_income: totalIncome,
            total_payment: totalPayment,
            total_profit: totalIncome - totalPayment
        });
        },function(err){
            logger.error(err);
        })
});

router.post('/bulk-pay', function (req, res) {
    var conditions = {};

    for (var key in req.body.filterByFields) {
        if (req.body.filterByFields.hasOwnProperty(key) && req.body.filterByFields[key] != null && req.body.filterByFields[key] != "") {
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
    
    if(req.body.fromDate != undefined && req.body.toDate != undefined){
        conditions['created_at']={$gte:req.body.fromDate, $lte:req.body.toDate};
    }else if(req.body.fromDate != undefined ){
        conditions['created_at']={$gte:req.body.fromDate};
    }else if(req.body.toDate != undefined ){
        conditions['created_at']={$lte:req.body.toDate};
    }

    var query = Policy.find(conditions);
    query
        .exec()
        .then(function(policies){
            for(var i = 0; i < policies.length; i++){
              policies[i].policy_status = '已支付';  
              policies[i].paid_at = Date.now();  
              policies[i].save();
              logger.info(req.user.name + " 更新了一份寿险保单，保单号为："+ policies[i].policy_no +"。"+ req.clientIP);
            };
        logger.info(req.user.name + " 批量支付了寿险保单。"+ req.clientIP);     
        res.json({message: '保单已成功批量支付'});       
        },function(err){
            logger.error(err);
        })
});

module.exports = router;
