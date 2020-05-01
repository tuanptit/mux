var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mongoose = require('mongoose');
var app = express();
var snmp = require ("net-snmp");
var async = require('async');
var tcpPortUsed = require('tcp-port-used');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
mongoose.connect('mongodb://localhost:27017/kilomux-management');
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// snmp.createReceiver(options,callback);
// sockIO.on('connection', function(socket){
//   socket.on('trap', function () {
//     tcpPortUsed.check(162,'172.0.0.1').then(function (inUsed) {
//       if(inUsed == false) {
//         console.log('not use')
//         snmp.createReceiver(options,function (error, data) {
//           console.log(data)
//           socket.emit('trap', data);
//         });
//       } else {
//         console.log('used')
//       }
//     }, function (err) {
//       console.log(err.toString());
//     })
//   });
// });

// snmp.createReceiver(options, function (error, data) {
//   sockIO.on('connection', function (socket) {
//   });
// });

// tcpPortUsed.check(3000, '127.0.0.1')
//     .then(function(inUse) {
//       if(inUse == false) {
//         console.log('not use')
//       } else {
//         console.log('used')
//       }
//     }, function(err) {
//       console.error('Error on check:', err.message);
//     });

// snmp.createReceiver(options, function (error, data) {
//   sockIO.on('connection', function (socket) {
//     console.log('trap receiver');
//     sockIO.sockets.emit('trap', data);
//   })
// });


module.exports = app;
