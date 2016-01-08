var express = require('express');
var router = express.Router();
var wechat = require('wechat');

var config = {
  token: 'H4MbzV5LAd3n',
  appid: 'wxd168d39b1572120f',
  //encodingAESKey: 'T1KvARk5KdSAdJ2ERidwVaC2mSmU5z80GUMjyq5HGnw',
  //corpId: 'wxb9a60da724795b2e'
};

router.get('/', wechat(config, function (req, res, next) {
  res.writeHead(200);
  res.end('hello node api');
}));

router.post('/wechat', wechat(config, function (req, res, next) {
  // 微信输入信息都在req.weixin上
  var message = req.weixin;
  console.log(message.FromUserName);
    res.reply('429的哥子些，周末愉快');
  
}));
module.exports = router;
