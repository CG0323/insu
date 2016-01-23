var express = require('express');
var passport = require('passport');
var db = require('../utils/database.js').connection;
var User = require('../models/user.js')(db);
var router = express.Router();
var logger = require('../utils/logger.js');


router.get('/me', function(req, res, next) {
  res.send(req.user);
});

// 临时接口
router.get('/register-cdy01', function(req, res) {
  User.register(new User({ username : 'cdy01', name: '李静', role: '出单员', organization: '红叶徐州分公司睢宁营业部'}), 'cdy01123', function(err, user) {
    if (err) {
      logger.error(err);
      res.redirect('/#/login');
    }else{
      res.status(200).json({status: 'registered'});
    }
  });
});

// 临时接口
router.get('/register-cdy02', function(req, res) {
  User.register(new User({ username : 'cdy02', name:'凌玲', role: '出单员', organization: '红叶徐州分公司睢宁营业部'}), 'cdy02234', function(err, user) {
    if (err) {
      logger.error(err);
      res.redirect('/#/login');
    }else{
      res.status(200).json({status: 'registered'});
    }
  });
});

// 临时接口
router.get('/register-cn01', function(req, res) {
  User.register(new User({ username : 'cn01', name:'出纳', role: '财务'}), 'cn01987', function(err, user) {
    if (err) {
      logger.error(err);
      res.redirect('/#/login');
    }else{
      res.status(200).json({status: 'registered'});
    }
  });
});

router.post('/logout', function(req, res) {
  logger.info(req.user.name + " 登出系统。"+ getClientIp(req));
  req.logout();
  res.status(200).json({status: 'Bye!'});
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      logger.error(err);
      return res.status(500).send(err);
    }
    if (!user) {
      return res.status(401).send(info);
    }
    req.logIn(user, function(err) {
      if (err) {
        logger.error(err);
        return res.status(500).send('无法登录该用户');
      }
      logger.info(user.name + " 登录系统。"+ getClientIp(req));
      res.status(200).json(user);
    });
  })(req, res, next);
});

function getClientIp(req) {
        console.log(req);
        return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    };

module.exports = router;
