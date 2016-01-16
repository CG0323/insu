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
  var query1 = { 'name': '振宁汽贸' };
  var newData1 = {
    'name': '振宁汽贸',
    'type': '机构',
  };
  var promise1 = Client.findOneAndUpdate(query1, newData1, { upsert: true }).exec();
  var query2 = { 'name': '郭永秋' };
  var newData2 = {
    'name': '郭永秋',
    'type': '个人',
  };
  var promise2 = Client.findOneAndUpdate(query2, newData2, { upsert: true }).exec();
  Q.all([promise1, promise2]).then(function (clients) {
    res.status(200).json({ status: 'Clients added!' });
  });
});

module.exports = router;
