var express = require('express');
var router = express.Router();
var wechat = require('wechat-enterprise');

var config = {
  token: 'H4MbzV5LAd3n',
  encodingAESKey: 'T1KvARk5KdSAdJ2ERidwVaC2mSmU5z80GUMjyq5HGnw',
  corpId: 'wxb9a60da724795b2e'
};

app.use('/auth', wechat(config, function (req, res, next) {
  res.writeHead(200);
  res.end('hello node api');
}));
module.exports = router;
