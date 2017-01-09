var express = require('express');
var db = require('../utils/database.js').connection;
var Company = require('../models/company.js')(db);
var router = express.Router();
var Q = require('q');
var logger = require('../utils/logger.js');

router.get('/', function (req, res, next) {
  Company.find({level:undefined})
    .populate('catogory')
    .exec()
    .then(function (companies) {
      res.json(companies);
    },
    function (err) {
      res.status(500).end();
    }
    )
});

router.get('/hotfix1', function (req, res) {
  Company.update({parent:"58105de0d248c66f34f7815d"}, {parent:"587353b6149236fc259757a9"},{ multi: true })
  .exec()
    .then(function (companies) {
      res.json(companies);
    },
    function (err) {
      res.status(500).end();
    }
    )

});

router.get('/hotfix2', function (req, res) {
  Company.update({parent:"57fd87e886be06094a02195d"}, {parent:"587353fb149236fc259757ab"},{ multi: true })
  .exec()
    .then(function (companies) {
      res.json(companies);
    },
    function (err) {
      res.status(500).end();
    }
    )

});

router.get('/level2', function (req, res) {
  Company.find({level:"二级"})
    .populate('catogory')
    .exec()
    .then(function (companies) {
      res.json(companies);
    },
    function (err) {
      res.status(500).end();
    }
    )
});

router.get('/level3', function (req, res) {
  Company.find({level:"三级"})
    .populate('catogory')
    .exec()
    .then(function (companies) {
      res.json(companies);
    },
    function (err) {
      res.status(500).end();
    }
    )
});

router.get('/level4', function (req, res) {
  Company.find({level:"四级"})
    .populate('catogory')
    .exec()
    .then(function (companies) {
      res.json(companies);
    },
    function (err) {
      res.status(500).end();
    }
    )
});

router.get('/:id', function (req, res) {
  Company.findOne({ _id: req.params.id })
    .exec()
    .then(function (company) {
      res.status(200).json(company);
    }, function (err) {
      logger.error(err);
      res.status(500).send(err);
    });
});

router.post('/', function (req, res) {
  var data = req.body;
  Company.find({ name: data.name, level:{$exists:true} }, function (err, companies) {
    if (companies.length > 0) {
      res.status(400).send('系统中已存在该公司名称');
    } else {
      var company = new Company(data);
      company.save(function (err, savedCompany, numAffected) {
        if (err) {
          logger.error(err);
          res.status(500).send(err);
        } else {
          logger.info(req.user.name + " 添加了一个保险公司，保险公司名称为：" + savedCompany.name + "。" + req.clientIP);
          res.status(200).json({ message: '保险公司已成功添加' });
        }
      });
    }
  })
});

router.put('/:id', function (req, res) {
  Company.findById(req.params.id, function (err, company) {
    if (err)
      res.send(err);
    company.name = req.body.name;
    company.contact = req.body.contact;
    company.phone = req.body.phone;
    company.catogory = req.body.catogory;
    company.rates = req.body.rates;
    // company.rates_based_on_taxed = req.body.rates_based_on_taxed;
    company.save(function (err) {
      if (err) {
        logger.error(err);
        res.send(err);
      }
      logger.info(req.user.name + " 更新了保险公司信息，保险公司名称为：" + company.name + "。" + req.clientIP);
      res.json({ message: '保险公司已成功更新' });
    });

  });
});

router.delete('/:id', function (req, res) {
  Company.remove({ _id: req.params.id }, function (err, company) {
    if (err) {
      logger.error(err);
      res.send(err);
    }
    logger.info(req.user.name + " 删除了一个保险公司。" + req.clientIP);
    res.json({ message: '保险公司已成功删除' });
  });
});

router.get('/sub/:parentId', function (req, res) {
  Company.find({ parent: req.params.parentId })
    .exec()
    .then(function (companies) {
      if (companies.length > 0) {
        res.status(200).json(companies);
      } else {
        Company.find({ catogory: req.params.parentId, level:"二级" })
          .exec()
          .then(function (companies) {
            res.status(200).json(companies);
          }, function (err) {
            logger.error(err);
            res.status(500).send(err);
          });
      }
    }, function (err) {
      logger.error(err);
      res.status(500).send(err);
    });
});



module.exports = router;
