var express = require('express');
var router = express.Router();
var wechat = require('wechat');
var WechatAPI = require('wechat-api');
var appConfig = require('../common.js').config();
var OAuth = require('wechat-oauth');
var client = new OAuth(appConfig.app_id, appConfig.app_secret);

var api = new WechatAPI(appConfig.app_id, appConfig.app_secret);

var menu = JSON.stringify(require('../test/data/menu.json'));
api.createMenu(menu, function (err, result) {
  if (err) {
    console.log(err);
  }
});


// var config = {
//   token: 'H4MbzV5LAd3n',
//   appid: 'wxd168d39b1572120f',
//   //encodingAESKey: 'T1KvARk5KdSAdJ2ERidwVaC2mSmU5z80GUMjyq5HGnw',
//   //corpId: 'wxb9a60da724795b2e'
// };

router.get('/', wechat(appConfig.token, function (req, res, next) {
  res.writeHead(200);
  res.end('hello from node api');
}));

router.post('/', wechat(appConfig.token, wechat.text(function (message, req, res, next) {
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
  } else if (text == '我是谁') {
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
 
 
//wechat web apis
 
router.get('/view', function (req, res) {
  var url = client.getAuthorizeURL('http://' + appConfig.domain + '/wechat/callback', '', 'snsapi_userinfo');
  res.redirect(url)
})

router.get('/callback', function (req, res) {
  console.log('----weixin callback -----')
  var code = req.query.code;
  client.getAccessToken(code, function (err, result) {
    var accessToken = result.data.access_token;
    var openid = result.data.openid;
    console.log('token=' + accessToken);
    console.log('openid=' + openid);

    console.log('user is not exist.')
    client.getUser(openid, function (err, result) {
      console.log(result)
      var oauth_user = result;
      res.send(res);
          
      // } else {
      //   console.log('根据openid查询，用户已经存在')
      //   // if phone_number exist,go home page
      //   if (user.is_valid == true) {
      //     req.session.current_user = user;
      //     res.redirect('/mobile')
      //   } else {
      //     //if phone_number exist,go to user detail page to fill it
      //     req.session.current_user = void 0;
      //     res.redirect('/users/' + user._id + '/verify');
      //   }
      // }
    });
  });
});


module.exports = router;
