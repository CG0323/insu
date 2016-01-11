var expect = require('chai').expect;
var querystring = require('querystring');
var request = require('supertest');
var template = require('./support').template;
var tail = require('./support').tail;
var app = require('../app.js');

function get_q() {
  var q = {
    timestamp: new Date().getTime(),
    nonce: parseInt((Math.random() * 10e10), 10)
  };
  var s = ['H4MbzV5LAd3n', q.timestamp, q.nonce].sort().join('');
  q.signature = require('crypto').createHash('sha1').update(s).digest('hex');
  q.echostr = 'hehe';
  return q;
};

describe('微信公众号服务器后台测试',function(){
  describe('接入鉴权测试',function(){
	it('拒绝非法的接入请求', function (done) {
      request(app)
      .get('/wechat')
      .expect(401)
      .expect('Invalid signature', done);
    });
  it('接受合法的接入请求', function (done) {
      request(app)
      .get('/wechat?' + querystring.stringify(get_q()))
      .expect(200)
      .expect('hehe', done);
    });
   it('回复消息', function (done) {
      request(app)
      .get('/wechat?' + querystring.stringify(get_q()))
      .expect(200)
      .expect('hehe', done);
    });
  });
  describe('消息处理测试', function (done){
    it('回复消息', function (done) {
      var info = {
        sp: 'wx',
        user: 'cg',
        type: 'text',
        text: '测试中'
      };
      console.log(template(info));
      request(app)
      .post('/wechat?' + querystring.stringify(get_q()))
      .send(template(info))
      .expect(200)
      .end(done);
      // .end(function(err, res){
      //   console.log(res);
      //   if (err) return done(err);
      //   var body = res.text.toString();
      //   body.should.include('<ToUserName><![CDATA[cg]]></ToUserName>');
      //   body.should.include('<FromUserName><![CDATA[wx]]></FromUserName>');
      //   body.should.include('<MsgType><![CDATA[text]]></MsgType>');
      //   //body.should.include('<Content><![CDATA[hehe]]></Content>');
      //   done();
      // });
    });
  });
});   
