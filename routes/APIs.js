var express = require('express');
var orders = require('./orders.js');
var clients = require('./clients.js');
var policies = require('./policies.js');
var router = express.Router();

/* GET home page. */
router.use('/', ensureAuthenticated);
router.use('/orders', orders);
router.use('/clients', clients);
router.use('/policies', policies);

function ensureAuthenticated(req, res, next) {
    console.log('Calling: ensureAuthenticated.....');
    if (req.isAuthenticated()) {
        return next();
    } else{
        console.log(req.user);
        res.status(401).send("请先登录");
    }
};

module.exports = router;
