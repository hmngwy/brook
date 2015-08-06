var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Post = require('./models/post').model;
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
    // add post._id to user posts history (user.posts)
    req.user.posts.push(res.locals.bundle._id);
    req.user.save();
  }
  next();
});

postResource.route("upvote", {
  handler: function(req, res, next) {
    //req.params.id
    if(req.user) { /*hack, passport doesn't wrap with node-restful*/

      if(req.user.upvoted_posts.indexOf(req.params.id) === -1) { // user hasn't upvoted it yet

        Post.findOne({_id:req.params.id}).exec(function (err, doc) {
           if(doc) {
             // increment post.votes
             doc.votes = doc.votes + 1;
             doc.save();
             // add post._id to user post votes history
             req.user.upvoted_posts.push(doc._id);
             req.user.save();
           }
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

  if(res.locals.bundle._id) {

    // add comment._id to user comments history
    req.user.posts_commented.push(res.locals.bundle.pid); //should we post PID instead
    req.user.comments.push(res.locals.bundle._id); //should we post PID instead
    req.user.save();

    // find root post to push comment
    Post.findOne({_id: req.body.pid}).populate('op').exec(function(err, post){
      if(post) {

        // push to general comments list
        post.comments.push(res.locals.bundle._id);
        if(req.body.type == 'direct') {
          // push to direct comments list, we use this to start recursive render
          post.direct_comments.push(res.locals.bundle._id);
        } else if(req.body.type == 'thread') {
          // not a direct comment, don't push to post.direct_comments
          // instead find the comment user responded to and push response there
          // this is where it threads
          Comment.findOne({_id: req.body.cid}).populate('op').exec(function(err, comment){
            if(comment) {
              comment.responses.push(res.locals.bundle._id);
              comment.save();

              // TODO now find op of this comment, and push a notification
              comment.op.notifications.push({
                message: 'Your comment on "'+post.title+'" received a <a href="/topic/'+post._id+'#comment-'+res.locals.bundle._id+'">response</a> a response from '+req.user.username+'.'
              });
              comment.op.save();
            }
          });
        }

        // TODO now use op and push a notification
        // this should notify the post op
        post.op.notifications.push({
          message: 'Your topic "'+post.title+'" received a <a href="/topic/'+post._id+'#comment-'+res.locals.bundle._id+'">response</a> from '+req.user.username+'.'
        });
        post.op.save();

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

        Comment.findOne({_id:req.params.id}).exec(function (err, doc) {
           if(doc) {
             // increment comment.votes
             doc.votes = doc.votes + 1;
             doc.save();
             // add comment._id to user comment votes history
             req.user.upvoted_comments.push(doc._id);
             req.user.save();
           }
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
