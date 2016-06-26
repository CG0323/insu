var express = require('express');
var orders = require('./orders.js');
var clients = require('./clients.js');
var policies = require('./policies.js');
var lifePolicies = require('./lifePolicies.js')
var lifeSalaries = require('./lifeSalaries.js');
var lifeStatements = require('./lifeStatements.js');
var organizations = require('./organizations.js');
var companies = require('./companies.js');
var companyCatogories = require('./companyCatogories.js');
var router = express.Router();

/* GET home page. */
router.use('/', ensureAuthenticated);
router.use('/orders', orders);
router.use('/clients', clients);
router.use('/policies', policies);
router.use('/organizations', organizations);
router.use('/companies', companies);
router.use('/companycatogories', companyCatogories);
router.use('/life-policies', lifePolicies);
router.use('/life-salaries', lifeSalaries);
router.use('/life-statements', lifeStatements);
function ensureAuthenticated(req, res, next) {
    // console.log('Calling: ensureAuthenticated.....');
    if (req.isAuthenticated()) {
        return next();
    } else{
        console.log(req.user);
        res.status(401).send("请先登录");
    }
};

module.exports = router;
