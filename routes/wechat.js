var express = require('express');
var router = express.Router();
var wechat = require('wechat');

var config = {
  token: 'H4MbzV5LAd3n',
  appid: 'wxd168d39b1572120f',
  //encodingAESKey: 'T1KvARk5KdSAdJ2ERidwVaC2mSmU5z80GUMjyq5HGnw',
  //corpId: 'wxb9a60da724795b2e'
};

router.get('/auth', wechat(config, function (req, res, next) {
  res.writeHead(200);
  res.end('hello node api');
}));



module.exports = router;
