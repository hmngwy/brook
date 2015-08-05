var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Post = require('./models/post').model;
var Account = require('./models/account').model;
var Comment = require('./models/comment').model;

var postResource = require('./models/post').model
  .methods(['get', 'post']);

postResource.before('post', function(req, res, next){
  if(req.user) { /*hack, passport doesn't wrap with node-restful*/
    for (var key in req.body) {
      if (['channel', 'url', 'title', 'body'].indexOf(key) === -1) {
        delete req.body[key];
      }
    }
    req.body.op = req.user._id;
    
    next();
  } else {
    res.status(403).json({error:'Login required.'});
  }
});

postResource.after('post', function(req, res, next){
  if(res.locals.bundle._id) {
    Account.findOne({_id:res.locals.bundle.op}).exec(function(err, account){
      if(account) {
        account.posts.push(res.locals.bundle._id);
        account.save();
      }
    });
  }
  next();
});

postResource.route("upvote", {
  handler: function(req, res, next) {
    //req.params.id
    if(req.user) { /*hack, passport doesn't wrap with node-restful*/

      if(req.user.upvoted_posts.indexOf(req.params.id) === -1) { // user hasn't upvoted it yet

        Account.findOne({_id: req.user._id}).exec(function (err, user) {
          Post.findOne({_id:req.params.id}).exec(function (err, doc) {
             if(doc) {
               doc.votes = doc.votes + 1;
               doc.save();
               user.upvoted_posts.push(req.params.id);
               user.save();
             }
          });
        });

      }

      res.json({k:true}); //silent fail

      // return next();
    } else {
      res.status(403).json({error:'Login required.'});
    }
  },
  detail: true,
  methods: ['get']
});

var commentResource = require('./models/comment').model
  .methods(['get', 'post']);

commentResource.before('post', function(req, res, next){
  if(req.user) { /*hack, passport doesn't wrap with node-restful*/
    for (var key in req.body) {
      if (['body', 'parent', 'type', 'pid', 'cid'].indexOf(key) === -1) {
        delete req.body[key];
      }
    }

    req.body.op = req.user._id;
    next();
  } else {
    res.status(403).json({error:'Login required.'});
  }
});


commentResource.after('post', function(req, res, next){
  //now ref this comment to discussion and parent

  // console.log(res.locals.bundle);
  // console.log(req.body);

  if(res.locals.bundle._id) {

    console.log('here', res.locals.bundle._id);

    Account.findOne({_id:res.locals.bundle.op}).exec(function(err, account){
      if(account) {
        account.comments.push(res.locals.bundle._id);
        account.save();
      }
    });

    Post.findOne({_id: req.body.pid}).exec(function(err, post){
      if(post) {

        post.comments.push(res.locals.bundle._id);
        if(req.body.type == 'direct') {
          post.direct_comments.push(res.locals.bundle._id);
        } else if(req.body.type == 'thread') {
          Comment.findOne({_id: req.body.cid}).exec(function(err, comment){
            if(comment) {
              comment.responses.push(res.locals.bundle._id);
              comment.save()
            }
          });
        }

        post.save();
      }
    });

  }


  next();
});

commentResource.route("upvote", {
  handler: function(req, res, next) {
    //req.params.id
    if(req.user) { /*hack, passport doesn't wrap with node-restful*/

      if(req.user.upvoted_comments.indexOf(req.params.id) === -1) { // user hasn't upvoted it yet

        Account.findOne({_id: req.user._id}).exec(function (err, user) {
          Comment.findOne({_id:req.params.id}).exec(function (err, doc) {
             if(doc) {
               doc.votes = doc.votes + 1;
               doc.save();
               user.upvoted_comments.push(req.params.id);
               user.save();
             }
          });
        });

      }

      res.json({k:true}); //silent fail

      // return next();
    } else {
      res.status(403).json({error:'Login required.'});
    }
  },
  detail: true,
  methods: ['get']
});


module.exports.postResource = postResource;
module.exports.commentResource = commentResource;
