var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var config = require('../config');
var validators = require('mongoose-validators');

var Account = new Schema({
  quality : { type: Number, default: 0 },
  karma : { type: Number, default: 0 },
  // votes user received from all his posts and comments
  comment_votes_received : { type: Number, default: 0 },
  post_votes_received : { type: Number, default: 0 },
  // user post submissions
  posts : [ { type: Schema.Types.ObjectId, ref: 'Post' } ],
  // user comment submissions
  comments : [ { type: Schema.Types.ObjectId, ref: 'Comment' } ],
  // posts user enaged in
  posts_commented: [ { type: Schema.Types.ObjectId, ref: 'Post' } ],
  // comments and posts user upvoted
  upvoted_posts : [ { type: Schema.Types.ObjectId, ref: 'Post' } ],
  upvoted_comments : [ { type: Schema.Types.ObjectId, ref: 'Comment' } ],
  // user register date
  ts_created: { type: Date, default: Date.now },
  // role assigned by admin
  status: { type: String,
    enum: ['normal', 'banned', 'hell-banned'], default: 'normal' },
  // role assigned by admin
  role: { type: String,
    enum: ['super', 'admin', 'editor', 'moderator', 'basic'], default: 'basic' },
  // violations issued by moderators
  violations: [{ ts_created: {type: Date, default: Date.now, index: false}, message: {type: String, index:false} }],
  // messages auto created by the system
  notifications: [{ ts_created: {type: Date, default: Date.now, index: false}, message: {type: String, index:false} }]
});

Account.plugin(passportLocalMongoose, {
  userExistsError: 'userExistsError'
});

Account.pre('save', function(next){

  // TODO compute karma like this


  // quality: sumVotes / ( (postCount/2) + (commentCount/10) )
  // commentCount/10 because 1 post = 10 comments
  // if you get at least 1 vote every 2 topics, and 1 vote every 10 comments
  // you should at least get a quality index of 1
  var activityFactor = (this.posts.length * config.post_karma_factor) +
                      (this.comments.length * config.comment_karma_factor);
  var sumOfVotesReceived = this.post_votes_received + this.comment_votes_received;
  var quality = sumOfVotesReceived / activityFactor;

  //karma: postVotes/2 + commentVotes/10
  // you'll get 1 karma point for every 2 of your posts upvoted
  // and another for every 10 of your comments upvoted
  var karma = (this.post_votes_received * config.post_karma_factor) +
              (this.comment_votes_received * config.comment_karma_factor);

  this.quality = Math.round(quality);
  this.karma = Math.round(karma);

  next();
});

module.exports.model = mongoose.model('Account', Account);
