var express = require('express');
var router = express.Router();
var wechat = require('wechat');
var WechatAPI = require('wechat-api');
var appConfig = require('../common.js').config();

var api = new WechatAPI(appConfig.app_id, appConfig.app_secret);

var config = {
  token: 'H4MbzV5LAd3n',
  appid: 'wxd168d39b1572120f',
  //encodingAESKey: 'T1KvARk5KdSAdJ2ERidwVaC2mSmU5z80GUMjyq5HGnw',
  //corpId: 'wxb9a60da724795b2e'
};

router.get('/', wechat('H4MbzV5LAd3n', function (req, res, next) {
  res.writeHead(200);
  res.end('hello from node api');
}));



router.post('/', wechat('H4MbzV5LAd3n', wechat.text(function (message, req, res, next) {
  var openId = message.FromUserName;
  var text = message.Content;
  if (text == '我叫什么') {
    api.getUser(openId, function (err, data) {
      if (err) {

      } else {
        var nickname = data.nickname;
        res.reply("你叫" + nickname + "嘛。");
      }
    });
  }else if(text == '我是谁'){
    api.getUser(openId, function (err, data) {
      if (err) {

      } else {
        var remark = data.remark;
        res.reply("你是" + remark + "。");
      }
    });
  }
})
 .image(function (message, req, res, next) {
    res.redirect('/#');
 })
 ));

module.exports = router;
