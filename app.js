var express = require('express');
var path = require('path');
var logger = require('morgan');
var route = require("./app/url-shrt.js");
var index = require('./routes/index.js');
var mongo = require("mongodb").MongoClient;

var app = express();
require("dotenv").config();
var url1 = process.env.MONGOLAB_URI;
mongo.connect(url1 , function(err, db) {

  if (err) {
    throw new Error('Database failed to connect!');
  } else {
    console.log('Successfully connected to MongoDB.');
  }

  // The format follows as, alias to use for real path, also allows permission to such path.

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));



  db.createCollection("sites", {
    capped: true,
    size: 5242880,
    max: 5000
  });

route(app, db);
index(app, db);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

});


module.exports = app;