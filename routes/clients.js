var express = require('express');
var db = require('../utils/database.js').connection;
var Client = require('../models/client.js')(db);
var router = express.Router();
var Q = require('q');
/* GET users listing. */
router.get('/', function(req, res, next) {
  Client.find().exec()
  .then(function(clients){
    res.json(clients);
  },
  function(err){
    res.status(500).end();
  }
  )
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
