var express = require('express');
var app = require('../app');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  //res.render('index', { title: 'Express' });
  res.render('index.html');
});

/* GET home page. */
router.get('/form', function(req, res) {
  res.render('form.html');
});

module.exports = router;
 