var express = require('express');
var app = require('../app');
var router = express.Router();

var _ = require("underscore");
// database in coachDB
var nano = require('nano')('http://localhost:5984');
var db = nano.use('thehighesthumantower');

var couchDBModel = require('couchdb-model');
var myModel = couchDBModel(db);



/* GET home page. */
router.get('/', function(req, res) {
  //res.render('index', { title: 'Express' });
  res.render('index.html');
});

/* GET home page. */
router.get('/demo', function(req, res) {
  res.render('demo', { });
});

/* Export json */
router.get('/tower-json', function(req, res) {
  myModel.findAll(function(error, results) {
    if (error){
    	console.error('failed list documents');
    }else{
    	// filter to objects need to display
    	var list = [];
    	for(var i =0;i<results.length;i++){
    		list.push(_.pick(results[i],'heighPerson'));
    	}
    	// return request as json 
    	res.setHeader('Content-Type','application/json');
    	res.end(JSON.stringify(list));
    }
  });
});

/* Receive new interaction */
router.post('/insert-new', function(req, res) {
    // specify the database we are going to use
    var heighPerson = req.body.heighPerson;
    db.insert({ heighPerson: heighPerson }, function(err, body, header) {
      if (err) {
        console.log('[db.insert] ', err.message);
        return;
      }
      
      // Give information
      router.io.sockets.emit('new-human',{id:'1231312',heighPerson:123});
      // upload to internet
      res.setHeader('Content-Type','application/json');
      res.end(JSON.stringify(body));

      console.log(body);
    });
});

module.exports = router;
 