var expect = require('chai').expect;
var querystring = require('querystring');
var template = require('./support').template;
var tail = require('./support').tail;
var app = require('../app.js');
 //var request = require('supertest')('http://123.56.103.93');
 var request = require('supertest')(app);
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

function get_q_for_post() {
  var q = {};
  var s = ['H4MbzV5LAd3n', q.timestamp, q.nonce].sort().join('');
  q.signature = require('crypto').createHash('sha1').update(s).digest('hex');
  q.timestamp = new Date().getTime();
  q.nonce = parseInt((Math.random() * 10e10), 10);
  return q;
};

describe('微信公众号服务器后台测试',function(){
  describe('接入鉴权测试',function(){
	it('拒绝非法的接入请求', function (done) {
      request
      .get('/wechat')
      .expect(401)
      .expect('Invalid signature', done);
    });
  it('接受合法的接入请求', function (done) {
      request
      .get('/wechat?' + querystring.stringify(get_q()))
      .expect(200)
      .expect('hehe', done);
    });
  });

  
  describe('消息处理测试', function (done){    
    it('收到文字消息后回复响应内容', function (done) {
      var info = {
        sp: 'gh_85624a8679b8',
        user: 'oYIeTs_bn5V6GeSm93CXkbckzf3E',
        type: 'text',
        text: 'test'
      };

      request
      .post('/wechat' + tail())
      .set('Content-Type',  'text/xml') 
      .send(template(info))
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var body = res.text.toString();
        expect(body).include('<ToUserName><![CDATA[oYIeTs_bn5V6GeSm93CXkbckzf3E]]></ToUserName>');
        expect(body).include('<ToUserName><![CDATA[oYIeTs_bn5V6GeSm93CXkbckzf3E]]></ToUserName>');
        expect(body).include('<FromUserName><![CDATA[gh_85624a8679b8]]></FromUserName>');
        expect(body).match(/<CreateTime>\d{13}<\/CreateTime>/);
        expect(body).include('<MsgType><![CDATA[text]]></MsgType>');
        expect(body).include('<Content><![CDATA[系统暂时只能接收保单照片上传]]></Content>');
        done();
      });
    });
  });
  
});   
