var passport = require('passport');
var router = require('express').Router();
var config = require('./config');
var moment = require('moment');

var Post = require('./models/post').model;
var Comment = require('./models/comment').model;
var Account = require('./models/account').model;

// someone once told me this was good for debugging
var postsSorted = function postsByScore(filter, sort, cb) {

  Post.find(filter || {})
    .sort(sort || {})
    .populate('op')
    .limit(config.pageCount)
    .exec(cb);

}


router.get('/register', function(req, res) {
  res.render('register', {config: config, taken:req.query.taken!=undefined});
});

router.post('/register', function(req, res, next) {
  console.log('registering user');
  Account.register(new Account({ username: req.body.username }), req.body.password, function(err) {
    if (err) {
      console.log('error while user register!', err);
      if(err.message.indexOf('userExistsError')===0) {
         return res.redirect('/register?taken=✔︎');
      } else {
        return next(err);
      }
    }

    res.redirect('/login?register=✔︎');
  });
});

router.get('/user', function(req, res) {
  req.user.populate([{path:'posts', select:'title ts_created',
  options: { limit: 50 }}, {path:'posts_commented', select:'title ts_created',
  options: { limit: 50 }}], function(err, user){
    res.render('user', { user: user, config: config, password_reset:req.query.password!=undefined, try_again:req.query.try!=undefined });
  });
});

router.get('/login', function(req, res) {
  res.render('login', { user: req.user, config: config, try_again:req.query.try!=undefined, register_ok:req.query.register!=undefined });
});

router.post('/login', function(req, res, next) {

  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login?try=✔︎'); }
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


router.post('/reset', function(req, res, next) {

  passport.authenticate('local', function(err, user, info) {
    if(user) {

        user.setPassword(req.body.new, function(err){
          if(err) {
            err.status = 400;
            next(err);
          } else{
            user.save();
            res.redirect('/user?password=✔︎');
          }

        });

    } else {
      res.redirect('/user?try=✔︎');
    }
  })(req, res, next);

});


router.get('/about', function(req, res) {
  res.render('about', { user: req.user, config: config });
});


router.get('/rules', function(req, res) {
  res.render('rules', { user: req.user, config: config });
});


router.get('/topic/:id', function(req, res) {
  Post.findOne({_id:req.params.id}).populate('direct_comments').populate('op').exec(function(err, post){
    if(post) {

      post.comment_count = post.comments.length;

      // TODO have the depth here configurable in config.js
      Comment.deepPopulate(post.direct_comments,
        'op, '+
        'responses.op, responses.responses.op, responses.responses.responses.op, responses.responses.responses.responses.op, '+
        'responses.responses.responses.responses', function(err, data){

        // TODO Cache 'data'
        res.render('topic', { user: req.user, post: post, config: config });
      });

    }
  });
});

// / - all channels
// /~main - default channel
// /~:channel - user defined channel

// TODO make pagination controlled by url
// (/~:channel)?(/:filter)?/:pageby/:n

router.get('/(~:channel)?', function(req, res) {
  var where = {}
  if(req.params.channel) where.channel = req.params.channel;
  postsSorted(where, { score_c: -1 }, function(err, posts){
    res.render('index', {
      user: req.user,
      posts: posts,
      config: config,
      channel: req.params.channel,
      channelOrFilter: req.params.channel
    });
  });
});
router.get('(/~:channel)?/p/:n', function(req, res, next) {
  var where = {score_c:{'$lt':req.params.n}}
  if(req.params.channel) where.channel = req.params.channel;
  postsSorted(where, { score_c: -1 }, function(err, posts){

    res.render('index', {
      user: req.user,
      posts: posts,
      config: config,
      channel: req.params.channel,
      channelOrFilter: req.params.channel
    });

  });
});

router.get('(/~:channel)?/:filter', function(req, res, next) {

  var where = config.baseFilterMap(req.params.filter).where;
  if(req.params.channel) where.channel = req.params.channel;
  postsSorted(
    where,
    config.baseFilterMap(req.params.filter).sort,
    function(err, posts){

      res.render('index', {
        user: req.user,
        posts: posts,
        config: config,
        filter: req.params.filter,
        channel: req.params.channel,
        channelOrFilter: req.params.channel || req.params.filter
      });

  });

});
router.get('(/~:channel)?/:filter/p/:n', function(req, res, next) {

  var where = config.baseFilterMap(req.params.filter, req.params.n).where;
  if(req.params.channel) where.channel = req.params.channel;

  postsSorted(
    where,
    config.baseFilterMap(req.params.filter, req.params.n).sort,
    function(err, posts){

    if(posts.length) {
      res.render('index', {
        user: req.user,
        posts: posts,
        config: config,
        filter: req.params.filter,
        channel: req.params.channel,
        channelOrFilter: req.params.channel || req.params.filter
      });
    } else {
      var err = new Error('Page Empty');
      err.status = 404;
      next(err);
    }
  });

});

module.exports = router;
