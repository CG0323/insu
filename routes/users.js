var express = require('express');
var passport = require('passport');
var db = require('../utils/database.js').connection;
var User = require('../models/user.js')(db);
var router = express.Router();
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 临时接口
router.get('/register-cdy01', function(req, res) {
  User.register(new User({ username : 'cdy01', name: '李静' }), 'cdy01123', function(err, user) {
    if (err) {
      res.redirect('/#/login');
    }else{
      res.status(200).json({status: 'registered'});
    }
  });
});

router.get('/register-cdy02', function(req, res) {
  User.register(new User({ username : 'cdy02', name:'凌玲' }), 'cdy02234', function(err, user) {
    if (err) {
      res.redirect('/#/login');
    }else{
      res.status(200).json({status: 'registered'});
    }
  });
});

router.post('/logout', function(req, res) {
  req.logout();
  res.status(200).json({status: 'Bye!'});
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return res.status(500).json({err: err});
    }
    if (!user) {
      return res.status(401).json({err: info});
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({err: 'Could not log in user'});
      }
      res.status(200).json({status: 'Login successful!'});
    });
  })(req, res, next);
});

router.post('/ping', function(req, res){
  res.status(200).send("pong!");
});

module.exports = router;
