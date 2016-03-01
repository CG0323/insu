var express = require('express');
var db = require('../utils/database.js').connection;
var Client = require('../models/client.js')(db);
var router = express.Router();
var Q = require('q');
var logger = require('../utils/logger.js');
var mkPy = require('../utils/pinyin.js');

router.get('/', function(req, res, next) {
  var query = {};
  var type = req.query.type;
  if(type == "organization"){
    query = {client_type:'机构'};
  }else if(type == "individual"){
    query = {client_type:'个人'};
  }
  Client.find(query).exec()
  .then(function(clients){
    for(var i = 0; i<clients.length; i++){
      var name = clients[i].name;
      var py = mkPy(name);
      clients[i].py = py;
    }
    res.json(clients);
  },
  function(err){
    res.status(500).end();
  }
  )
});

router.get('/:id', function (req, res) {
  Client.findOne({_id: req.params.id})
    .exec()
    .then(function(client){
       res.status(200).json(client);
     },function(err){
       logger.error(err);
       res.status(500).send(err);
     });
});

router.post('/', function (req, res) {
  var data = req.body;
  Client.find({ name: data.name }, function (err, clients) {
    if (clients.length > 0) {
      res.status(400).send('系统中已存在该客户名称');
    } else {
      var client = new Client(data);
      client.save(function (err, savedClient, numAffected) {
        if (err) {
          logger.error(err);
          res.status(500).send(err);
        } else {
          logger.info(req.user.name + " 添加了一个客户账号，客户名称为："+ savedClient.name +"。"+ req.clientIP);
          res.status(200).json({ message: '客户信息已成功添加' });
        }
      });
    }

  })
});

router.put('/:id', function (req, res) {
    Client.findById(req.params.id, function (err, client) {
        if (err)
            res.send(err);
        client.name = req.body.name;
        client.short_name = req.body.short_name;
        client.client_type = req.body.client_type;
        client.identity = req.body.identity;
        client.payee = req.body.payee;
        client.bank = req.body.bank;
        client.account = req.body.account;
        client.phone = req.body.phone;
        client.wechats = req.body.wechats;
        client.save(function (err) {
            if (err){
              logger.error(err);
              res.send(err);
            }
            logger.info(req.user.name + " 更新了客户信息，客户名为："+ client.name +"。"+ req.clientIP);
            res.json({message: '客户信息已成功更新'});
        });

    });
});

router.delete('/:id', function (req, res) {
  Client.remove({_id: req.params.id}, function(err, client){
    if (err){
      logger.error(err);
      res.send(err);
    }
    logger.info(req.user.name + " 删除了一个客户。"+ req.clientIP);
    res.json({ message: '客户已成功删除' });
  });
});


router.get('/secret-add-clients', function (req, res, next) {
  var query1 = { 'name': '徐州市振宁物流有限公司' };
  var newData1 = {
    'name': '徐州市振宁物流有限公司',
    'short_name':'振宁汽贸',
    'client_type': '机构',
    'license_no': '320324000066863',
    'identity': '320324196603217022',
    'payee': '沈彩茹',
    'bank': '中国农业银行睢宁县支行营业部',
    'account': '6228480458912748076',
  };
  var promise1 = Client.findOneAndUpdate(query1, newData1, { upsert: true }).exec();
  var query2 = { 'name': '郭永秋' };
  var newData2 = {
    'name': '郭永秋',
    'short_name': '郭永秋',
    'client_type': '个人',
    'identity': '320324197311150043',
    'payee': '郭永秋',
    'bank': '中国农业银行睢宁县支行营业部',
    'account': '6228480459891805978'
  };
  var promise2 = Client.findOneAndUpdate(query2, newData2, { upsert: true }).exec();
  Q.all([promise1, promise2]).then(function (clients) {
    res.status(200).json({ status: 'Clients added!' });
  });
});



module.exports = router;
