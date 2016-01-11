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
  res.end('hello from node api');
}));

router.post('/', wechat('H4MbzV5LAd3n', wechat.text(function (message, req, res, next) {
  console.log(message);
    res.reply('您的保单已收到，系统将尽快核实处理，稍后您可以点击菜单中的［保单进度］了解处理进度。');
 })));



// router.post('/', wechat('H4MbzV5LAd3n', function (message, req, res, next) {
//   // 微信输入信息都在req.weixin上
//   // var message = req.weixin;
//   console.log(message);
//     res.reply('您的保单已收到，系统将尽快核实处理，稍后您可以点击菜单中的［保单进度］了解处理进度。');
// }));
module.exports = router;
