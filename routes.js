var passport = require('passport');
var router = require('express').Router();
var config = require('./config');
var _ = require('underscore');
var moment = require('moment');

var Post = require('./models/post').model;
var Comment = require('./models/comment').model;
var Account = require('./models/account').model;

router.get('/', function(req, res) {
  Post.find()
  .sort({ score_c: -1 })
  .populate('op')
  .limit(config.pageCount)
  .exec(function(err, posts){
    if(posts.length) {
      posts = _.map(posts, function(post){
        post.pretty_time = moment(post.ts_created).fromNow();
        post.comment_count = post.comments.length;
        return post;
      });
      res.render('index', { user: req.user, posts: posts, config: config });
    } else {
      res.render('index', { user: req.user, posts: [], config: config });
    }
  });
});

router.get('/p/:n', function(req, res, next) {
  Post.find({score_c:{'$lt':req.params.n}})
  .sort({ score_c: -1 })
  .populate('op')
  .limit(config.pageCount)
  .exec(function(err, posts){
    if(posts.length) {
      posts = _.map(posts, function(post){
        post.pretty_time = moment(post.ts_created).fromNow();
        post.comment_count = post.comments.length;
        return post;
      });
      res.render('index', { user: req.user, posts: posts, config: config });
    } else {
      var err = new Error('Page Empty');
      err.status = 404;
      next(err);
    }
  });
});


router.get('/topic/:id', function(req, res) {
  Post.findOne({_id:req.params.id}).populate('direct_comments').populate('op').exec(function(err, post){
    if(post) {

      post.pretty_time = moment(post.ts_created).fromNow();
      post.comment_count = post.comments.length;

      Comment.deepPopulate(post.direct_comments,
        'op, '+
        'responses.op, responses.responses.op, responses.responses.responses.op, responses.responses.responses.responses.op, '+
        'responses.responses.responses.responses', function(err, data){

        // TODO Cache 'data'

        post.direct_comments = _.map(data, function(comment){
          comment.pretty_time = moment(comment.ts_created).fromNow();
          return comment;
        });
        res.render('topic', { user: req.user, post: post, config: config });
      });

    }
  });
});

router.get('/register', function(req, res) {
  res.render('register', {config: config});
});

router.post('/register', function(req, res, next) {
  console.log('registering user');
  Account.register(new Account({ username: req.body.username }), req.body.password, function(err) {
    if (err) { console.log('error while user register!', err); return next(err); }

    console.log('user registered!');

    res.redirect('/');
  });
});

router.get('/user', function(req, res) {
  res.render('user', { user: req.user, config: config });
});

router.get('/login', function(req, res) {
  res.render('login', { user: req.user, config: config });
});

router.post('/login', function(req, res, next) {

  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


router.post('/reset', passport.authenticate('local'), function(req, res, next) {
  var Account = require('./models/account').model;
  Account.findOne({_id:req.user._id}).exec(function(err, a){
    if(a) {
      // console.log(req.params);
      a.setPassword(req.body.new, function(err){
        if(err) {
          err.status = 400;
          next(err);
        } else{
          a.save();
          res.redirect('/user');
        }

      });

    }
  });
});


router.get('/about', function(req, res) {
  res.render('about', { user: req.user, config: config });
});


router.get('/rules', function(req, res) {
  res.render('rules', { user: req.user, config: config });
});

module.exports = router;
