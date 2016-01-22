var express = require('express');
var router = express.Router();
var wechat = require('wechat');
var WechatAPI = require('wechat-api');
var appConfig = require('../common.js').config();
var OAuth = require('wechat-oauth');
var db = require('../utils/database.js').connection;
var User = require('../models/user.js')(db);

var client = new OAuth(appConfig.app_id, appConfig.app_secret);

var api = new WechatAPI(appConfig.app_id, appConfig.app_secret);

var menu = JSON.stringify(require('../test/data/menu.json'));
api.createMenu(menu, function (err, result) {
  if (err) {
    console.log(err);
  }
});

api.updateRemark('oYIeTs_bn5V6GeSm93CXkbckzf3E', '徐州市振宁物流有限公司', function (err, data, res) {
  console.log(data);
  api.updateRemark('oYIeTs6q8mmV6W0EeMGlJjLU9pjI', '郭永秋', function (err, data, res) {
    console.log(data);
    api.updateRemark('oYIeTsw96yjJyOV1IJfBrpK-QJgQ', '郭永秋', function (err, data, res) {
      console.log(data);
      api.updateRemark('oYIeTsyTg8kINdWmbZFEU4K3uQ0M', '郭永秋', function (err, data, res) {
        console.log(data);
        api.updateRemark('oYIeTs0uazo_lZJ6wMndK8f_UaC4', '郭永秋', function (err, data, res) {
          console.log(data);
        });
      });
    });
  });
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


    api.getUser(openid, function (err, result) {
      console.log(result)
      var oauth_user = result;
      User.find({ username: oauth_user.openid }).exec()
        .then(function (users) {
          if (users.length > 0) {
            var user = users[0];
            user.name = oauth_user.remark;
            user.role = "客户";
            return user;
          } else {
            User.register(new User({ username: oauth_user.openid, name: oauth_user.remark, role: '客户' }), '123456', function (err, user) {
              if (err) {
                res.status(500).json({ err: 'Could not register' });
              } else {
                return user;
              }
            });
          }
        })
        .then(function (in_user) {
          console.log(in_user);
          req.logIn(in_user, function (err) {
            if (err) {
              return res.status(500).json({ error: err });
            }
            res.status(200).json(in_user);
          });
        }, function(err){
          console.log(err);
        })
    });
  });
});


module.exports = router;
