var express = require('express');
var app = express();
var path = require('path');
var db = require('./db');
var middleware = require('./middleware');
var indexRouter = require('./routes/index');
var StudentRouter = require('./routes/students');

db();
middleware(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/', indexRouter);
app.use('/list', StudentRouter);

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

module.exports = app;
