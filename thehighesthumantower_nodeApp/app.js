var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var bodyParser = require('body-parser');

var formidable = require('formidable');
var util = require('util');
var fs = require('fs');
var mv = require('mv');

var _ = require("underscore");
// database in coachDB
var nano = require('nano')('http://localhost:5984');
var db = nano.use('thehighesthumantower');

var couchDBModel = require('couchdb-model');
var myModel = couchDBModel(db);

var app = express(); // bring app to anyfile
var server = require('http').createServer(app);

var io = null;
//var io = require('socket.io')(server);
// socket goes same port app, because listen app

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

server = require('http').createServer(app)

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('C:\\thehighesthumantower_contents'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

app.use('/', routes);
app.use('/users', users);

/* Export json */
app.get('/tower-json', function(req, res) {
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
app.post('/insert-new', function(req, res) {
    // specify the database we are going to use
    
    var form = new formidable.IncomingForm();

    var heighPerson = form.heighPerson;
    console.log("heighPerson:"+heighPerson);

    form.parse(req, function(err, fields, files) {
        
        db.insert({ heighPerson: heighPerson }, function(err, body, header) {
            if (err) {
                console.log('[db.insert] ', err.message);
                return;
            }
          
            // Give information
            io.sockets.emit('new-human',{id:'1231312',heighPerson:123});
            // Upload to internet
            res.setHeader('Content-Type','application/json');
            res.end(JSON.stringify(body));
            console.log(body);

            var serverPath = __dirname +'/public/captures/'+body.id;
            console.log(serverPath);
            // Create Folder
            var mkdirp = require('mkdirp');
            mkdirp(serverPath, function(err) {
                if(err){
                    console.log('Error creating folder', err.message);
                    return;
                }
                // Animation512
                var convert = require('netpbm').convert;
                var file_animation512 = files.animation512;
                convert(file_animation512.path, serverPath+'/'+file_animation512.name.replace(".png", ".jpg"), 
                  {},
                  function(err) {
                    if (!err) {
                      console.log("Your 512 image is ready!");
                    }
                  }
                );
                /*
                
                mv(file_animation512.path, serverPath+'/'+file_animation512.name, function(err) {
                    // handle the error
                    if (err) {
                        return console.log(err);
                    }
                    console.log('It\'s saved 512!');
                });
                // Animation1024
                var file_animation1024 = files.animation1024;
                mv(file_animation1024.path, serverPath+'/'+file_animation1024.name, function(err) {
                    // handle the error
                    if (err) {
                        return console.log(err);
                    }
                    console.log('It\'s saved 1024!');
                });
                // Animation2048
                var file_animation2048 = files.animation2048;
                mv(file_animation2048.path, serverPath+'/'+file_animation2048.name, function(err) {
                    // handle the error
                    if (err) {
                        return console.log(err);
                    }
                    console.log('It\'s saved 2048!');
                });
                */
            });
            
        });
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// configure your socket.io instance here
server.listen(3000, function() {
    io = require('socket.io').listen(server);
    routes.io = io;
    // server started
    io.on('connection', function(socket){
        console.log("connected socket");
    });
});

module.exports = app;



