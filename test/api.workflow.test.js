var expect = require('chai').expect;
var app = require('../app.js');
var testSession = require('supertest-session')(app);

var config = require('../common.js').config();
var mongoose = require('mongoose');

var client = {};
var policyId = '';

before(function (done) {
  function clearDB() {
    mongoose.connection.db.dropDatabase(function(err){
      return done();
    });
  }


  if (mongoose.connection.readyState === 0) {
    mongoose.connect(config.mongodb_server, function (err) {
      if (err) {
        throw err;
      }
      return clearDB();
    });
  } else {
    return clearDB();
  }
});


after(function (done) {
  mongoose.disconnect();
  return done();
});


describe('工作流测试', function () {
  describe('客户api测试', function () {
    it('用一号出单员账号登陆', function (done) {
      testSession.post('/users/login')
        .send({ username: 'cdy01', password: 'cdy01123' })
        .expect(200)
        .end(done);
    }); 
    it('添加两个客户', function (done) {
      testSession.get('/api/clients/secret-add-clients')
        .expect(200)
        .end(done);
    });
    it('登陆后成功获取客户列表', function (done) {
      testSession.get('/api/clients')
        .expect(200)
        .end(function(err, res){
        var data = JSON.parse(res.text);
        expect(err).to.be.null;
        expect(data.length).to.equal(2);
        client = data[0];
        done();
      });
    });
  });
  describe('保单api测试', function () {
    it('添加一份保单', function (done) {
      var policy = require('./data/policies.json')[0];
      policy.client = client._id;
      testSession.post('/api/policies')
        .send(policy)
        .expect(200)
        .end(done);
    });
    it('获取自己录入的保单,所有内容都已经填充', function (done) {
      testSession.get('/api/policies')
        .expect(200)
        .end(function(err, res){
        var data = JSON.parse(res.text);
        expect(err).to.be.null;
        expect(data.length).to.equal(1);
        expect(data[0].client.name).to.equal('振宁汽贸');
        expect(data[0].seller.name).to.equal('李静');
        policyId = data[0]._id;
        done();
      });
    });
    it('更新保单，修改保费金额', function (done) {
      var policy = require('./data/policies.json')[0];
      policy.insu_fee = 9999;
      testSession.put('/api/policies/' + policyId)
        .send(policy)
        .expect(200)
        .expect({message: '保单已成功更新'})
        .end(done);
    });
    it('再次获取保单，保费已成功更新', function (done) {
      testSession.get('/api/policies/' + policyId)
        .expect(200)
        .end(function(err, res){
        var data = JSON.parse(res.text);
        expect(err).to.be.null;
        expect(data.insu_fee).to.equal(9999);
        done();
      });
    });
    it('添加保单号重复保单失败', function (done) {
      var policy = require('./data/policies.json')[0];
      testSession.post('/api/policies')
        .send(policy)
        .expect(400)
        .expect('系统中已存在相同保单号的保单')
        .end(done);
    });
    it('登出', function (done) {
      testSession.post('/users/logout')
        .expect(200)
        .end(done);
    });
    it('注册二号出单员账号', function (done) {
      testSession.get('/users/register-cdy02')
        .expect(200)
        .end(done);
    }); 
    it('用二号出单员账号登陆', function (done) {
      testSession.post('/users/login')
        .send({ username: 'cdy02', password: 'cdy02234' })
        .expect(200)
        .end(done);
    }); 
    it('二号出单员无法获取一号出单员录入保单', function (done) {
      testSession.get('/api/policies')
        .expect(200)
        .end(function(err, res){
        var data = JSON.parse(res.text);
        expect(err).to.be.null;
        expect(data.length).to.equal(0);
        done();
      });
    }); 
    it('二号出单员添加一份保单', function (done) {
      var policy = require('./data/policies.json')[1];
      policy.client = client._id;
      testSession.post('/api/policies')
        .send(policy)
        .expect(200)
        .end(done);
    });
    it('登出', function (done) {
      testSession.post('/users/logout')
        .expect(200)
        .end(done);
    });
    it('注册出纳账号', function (done) {
      testSession.get('/users/register-cn01')
        .expect(200)
        .end(done);
    }); 
    it('用出纳账号登陆', function (done) {
      testSession.post('/users/login')
        .send({ username: 'cn01', password: 'cn01987' })
        .expect(200)
        .end(done);
    }); 
    it('获取所有待支付的保单，应为2条', function (done) {
      testSession.get('/api/policies/to-be-paid')
        .expect(200)
        .end(function(err, res){
        var data = JSON.parse(res.text);
        expect(err).to.be.null;
        expect(data.length).to.equal(2);
        done();
      });
    });
    it('获取所有已支付保单，应为0条', function (done) {
      testSession.get('/api/policies/paid')
        .expect(200)
        .end(function(err, res){
        var data = JSON.parse(res.text);
        expect(err).to.be.null;
        expect(data.length).to.equal(0);
        done();
      });
    });
    it('更新保单，修改状态为已支付', function (done) {
      var policy = require('./data/policies.json')[0];
      policy.policy_status = "已支付";
      testSession.put('/api/policies/' + policyId)
        .send(policy)
        .expect(200)
        .expect({message: '保单已成功更新'})
        .end(done);
    });
    it('获取所有待支付的保单，数目已减少1条', function (done) {
      testSession.get('/api/policies/to-be-paid')
        .expect(200)
        .end(function(err, res){
        var data = JSON.parse(res.text);
        expect(err).to.be.null;
        expect(data.length).to.equal(1);
        done();
      });
    });
    it('获取所有已支付保单，数目为1条', function (done) {
      testSession.get('/api/policies/paid')
        .expect(200)
        .end(function(err, res){
        var data = JSON.parse(res.text);
        expect(err).to.be.null;
        expect(data.length).to.equal(1);
        done();
      });
    });
    it('获取所有保单，数目为2条', function (done) {
      testSession.get('/api/policies')
        .expect(200)
        .end(function(err, res){
        var data = JSON.parse(res.text);
        expect(err).to.be.null;
        expect(data.length).to.equal(2);
        done();
      });
    });
    it('用一号出单员账号登陆', function (done) {
      testSession.post('/users/login')
        .send({ username: 'cdy01', password: 'cdy01123' })
        .expect(200)
        .end(done);
    }); 
    it('删除之前录入的保单', function (done) {
      testSession.delete('/api/policies/' + policyId)
        .expect(200)
        .expect({message: '保单已成功删除'})
        .end(done);
    });
  });
});