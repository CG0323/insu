var express = require('express');
var db = require('../utils/database.js').connection;
var Policy = require('../models/policy.js')(db);
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
          // policies.forEach(function(policy){
          //   policy.organization = policy.seller.org;
          //   console.log(policy.organization);
          //   policy.save();
          // });
          
        });
});

router.get('/excel', function (req, res) {
  var user = req.user;
  var query = {policy_status:'已支付'};
  if(user.role == '出单员'){
    query = {seller: user._id, policy_status:'已支付'};
  }
  Policy.find(query)
     .populate('client seller organization company')
     .exec()
     .then(function(policies){
       sendCSV(policies, res);     
     },function(err){
       logger.error(err);
       res.status(500).send(err);
     });
});

function sendCSV(policies, res){

       var json2csv = require('json2csv');
       var fields = [
         'created_at', 
         'policy_no',
         'company.name',
         'applicant.name',
         'plate_no',
         'applicant.phone',
         'organization.name',
         'seller.name',
         'client.name',
         'mandatory_fee',
         'mandatory_fee_income',
         'mandatory_fee_payment',
         'commercial_fee',
         'commercial_fee_income',
         'commercial_fee_payment',
         'tax_fee',
         'tax_fee_income',
         'tax_fee_payment',
         'payment_addition',
         'payment_substraction',
         'total_income',
         'total_payment',
         'status',
         'paid_at',
         'payment_bank'
         ];
       var fieldNames = [
         '提交日期', 
         '保单号',
         '保险公司',
         '投保人',
         '车牌号',
         '投保人电话',
         '营业部',
         '出单员',
         '业务渠道',
         '交强险',
         '交强险跟单费',
         '交强险结算费',
         '商业险',
         '商业险跟单费',
         '商业险结算费',
         '车船税',
         '车船税跟单费',
         '车船税结算费',
         '结算费加项',
         '结算费减项',
         '跟单费总额',
         '结算费总额',
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
            row.plate_no = policy.plate_no;
            row.applicant.phone = "'" + policy.applicant.phone;
            row.organization.name = policy.organization.name;
            row.seller.name = policy.seller.name;
            row.client.name = policy.client.name;
            row.mandatory_fee=policy.mandatory_fee;
            row.mandatory_fee_income=policy.mandatory_fee_income;
            row.mandatory_fee_payment=policy.mandatory_fee_payment;
            row.commercial_fee=policy.commercial_fee;
            row.commercial_fee_income=policy.commercial_fee_income;
            row.commercial_fee_payment=policy.commercial_fee_payment;
            row.tax_fee=policy.tax_fee;
            row.tax_fee_income=policy.tax_fee_income;
            row.tax_fee_payment=policy.tax_fee_payment;
            row.payment_addition = policy.payment_addition? policy.payment_addition : 0;
            row.payment_substraction = policy.payment_substraction? policy.payment_substraction : 0;
            row.total_income=policy.total_income;
            row.total_payment=policy.total_payment;
            row.status = policy.status;
            row.paid_at= (dateFormat(policy.paid_at, "mm/dd/yyyy"));
            row.payment_bank =policy.payment_bank;
          arr.push(row);
        }
        json2csv({ data: arr, fields: fields, fieldNames: fieldNames }, function (err, csv) {
          if (err) console.log(err);
          // var content = iconv.decode(csv, 'utf-8');
          var final = iconv.encode(csv, 'GBK');
          console.log(final);
          // final = final.replace("'''","'");
          res.setHeader('Content-Type', 'text/csv;charset=GBK');
          res.setHeader("Content-Disposition", "attachment;filename=" + "statistics.csv");
          res.end(final, 'binary');
        });
}

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
    console.log(conditions);
    var query = Policy.find(conditions);
    query
        .sort(sortParam)
        .populate('client seller organization company')
        .exec()
        .then(function(policies){
            sendCSV(policies, res);  
        },function(err){
            logger.error(err);
        })
});

// router.get('/excel', function (req, res) {
//   var user = req.user;
//   var query = {policy_status:'已支付'};
//   if(user.role == '出单员'){
//     query = {seller: user._id, policy_status:'已支付'};
//   }
//   Policy.find(query)
//      .populate('client seller organization company')
//      .exec()
//      .then(function(policies){
//         var nodeExcel=require('excel-export');
//         var dateFormat = require('dateformat');
//         var conf={};
//         conf.cols=[{
//             caption:'提交日期',
//             type:'string',
// 		        width:15
//         },
//         {
//             caption:'保单号',
//             type:'string',
//             width:30
//         },
//         {
//             caption:'保险公司',
//             type:'string',
//             width:50
//         },
//         {
//             caption:'投保人',
//             type:'string',
//             width:15
//         },
//         {
//             caption:'车牌号',
//             type:'string',
//             width:15
//         },
//         {
//             caption:'投保人电话',
//             type:'string',
//             width:15
//         },
//         {
//             caption:'营业部',
//             type:'string',
//             width:30
//         },
//         {
//             caption:'出单员',
//             type:'string',
//             width:15
//         },
//         {
//             caption:'业务渠道',
//             type:'string',
//             width:15
//         },
//         {
//             caption:'交强险',
//             type:'number',
//             width:10
//         },
//         {
//             caption:'交强险跟单费',
//             type:'number',
//             width:12
//         },
//         {
//             caption:'交强险结算费',
//             type:'number',
//             width:12
//         },
//         {
//             caption:'商业险',
//             type:'number',
//             width:10
//         },
//         {
//             caption:'商业险跟单费',
//             type:'number',
//             width:12
//         },
//         {
//             caption:'商业险结算费',
//             type:'number',
//             width:12
//         },
//          {
//             caption:'车船税',
//             type:'number',
//             width:10
//         },
//         {
//             caption:'车船税跟单费',
//             type:'number',
//             width:12
//         },
//         {
//             caption:'车船税结算费',
//             type:'number',
//             width:12
//         },
//         {
//             caption:'结算费加项',
//             type:'number',
//             width:12
//         },
//         {
//             caption:'结算费减项',
//             type:'number',
//             width:12
//         },
//         {
//             caption:'总跟单费',
//             type:'number',
//             width:10
//         },
//         {
//             caption:'总结算费',
//             type:'number',
//             width:10
//         },
//         {
//             caption:'利润',
//             type:'number',
//             width:10
//         },
//         {
//             caption:'支付日期',
//             type:'string',
//             width:12
//         },
//         {
//             caption:'支付银行',
//             type:'string',
//             width:10
//         }
//         ];
//         var arr = [];
//         for (var i = 0; i < policies.length; i++) {
//           var policy = policies[i];
//           var a = [
//             (dateFormat(policy.created_at, "mm/dd/yyyy")), 
//             policy.policy_no, 
//             policy.company.name,
//             policy.applicant.name,
//             policy.plate_no,
//             policy.applicant.phone,
//             policy.organization.name,
//             policy.seller.name,
//             policy.client.name,
//             policy.mandatory_fee,
//             policy.mandatory_fee_income,
//             policy.mandatory_fee_payment,
//             policy.commercial_fee,
//             policy.commercial_fee_income,
//             policy.commercial_fee_payment,
//             policy.tax_fee,
//             policy.tax_fee_income,
//             policy.tax_fee_payment,
//             policy.payment_addition ? policy.payment_addition : 0,
//             policy.payment_substraction ? policy.payment_substraction : 0,
//             policy.total_income,
//             policy.total_payment,
//             policy.total_income - policy.total_payment,
//             (dateFormat(policy.paid_at, "mm/dd/yyyy")),
//             policy.payment_bank 
//             ];
//           arr.push(a);
//         }
//         conf.rows = arr;
//         var result = nodeExcel.execute(conf);
//         res.setHeader('Content-Type', 'application/vnd.openxmlformates');
//         res.setHeader("Content-Disposition", "attachment;filename=" + "statistics.xlsx");
//         res.end(result, 'binary');
        
//      },function(err){
//        logger.error(err);
//        res.status(500).send(err);
//      });
// });


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
        // policy.insu_company = req.body.insu_company;
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
        policy.company = req.body.company;
        policy.organization = req.body.organization;
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




module.exports = router;
