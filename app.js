var express = require('express');
var compression = require('compression');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var methodOverride = require('method-override');
var config = require('./config');

var moment = require('moment');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();

// gzip
app.use(compression());

var hbs = exphbs.create({
  // Specify helpers which are only registered on this instance.
  helpers: {
    ifCond: function(v1, v2) {
      if(v1 || v2) {
        return true;
      }
      return false;
    },
    lastDate: function(array) {
      if(array.length)
        return moment(array[array.length-1].ts_created).valueOf();
      else
        return '';
    },
    lastScoreC: function(array) {
      if(array.length)
        return array[array.length-1].score_c;
      else
        return '';
    },
    isUpvotedComment: function (id, context) {
      if(context.data.root.user)
        if(context.data.root.user.upvoted_comments.indexOf(id) !== -1) return 'voted';
      else return '';
    },
    isUpvotedPost: function (id, context) {
      // console.log(context);
      if(context.data.root.user)
        if(context.data.root.user.upvoted_posts.indexOf(id) !== -1) return 'voted';
      else return '';
    },
    timeFromNow: function (date, context) {
      // console.log(context);
      return moment(date).fromNow();
    },
    count: function (array, context) {
      // console.log(context);
      return array.length;
    }
  }
});
// view engine setup
app.locals.layout = 'main'; // default layout
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());
app.use(cookieParser());
app.use(session({ keys: ['secretkey1', 'secretkey2', '...']}));

app.use(favicon(__dirname + '/public/favicon.ico'));

if(app.get('env') === 'development') {
  app.use(express.static(path.join(__dirname, 'public')));
} else {
  app.use(express.static(path.join(__dirname, 'dist/public')));
}

// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local to use account model for authentication
var Account = require('./models/account').model;
passport.use(new LocalStrategy(Account.authenticate()));

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.use(function(req, res, next){
  if(req.user && req.user.notifications) {
    req.user.notifications = req.user.notifications.reverse();
    req.user.notifications = req.user.notifications.slice(0, 50);
  }
  next();
});

// Connect mongoose
mongoose.connect(config.mongoConnectionString, function(err) {
  if (err) {
    console.log('Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!');
  }
});

// Register routes
app.use('/', require('./routes'));

var xhr = require('./xhr');
var postResource = app.postResource = xhr.postResource;
postResource.register(app, '/xhr/post');

var commentResource = app.commentResource = xhr.commentResource;
commentResource.register(app, '/xhr/comment');


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
    console.log(err.stack);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      config: config
    });
  });
}

// production error handler
// no stacktraces leaked to user
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.log(err.stack);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
      config: config
    });
  });
}


var scheduler = require('./scheduler');
scheduler.start();

module.exports = app;
