var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var validators = require('mongoose-validators');



var Account = new Schema({
  //sum of votes user received from all his posts and comments
  karma : { type: Number, default: 0 },
  //sum of votes user received from all his posts and comments
  votes_received : { type: Number, default: 0 },
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
  // base = posts + (comments/7)
  // karma = base + sum_of_votes / base
  // we divide comment count by 7, a comment is 1/7 of a post
  // we dived the base so that users are encouraged to post quality content

  // theory, this is more of a quality index
  // with less posts and more votes, you get a higher number
  // implies you have a high ratio of quality posts
  var base = this.posts.length + (this.comments.length / 7);
  var karma = (base + this.votes_received) / base;

  this.karma = Math.round(karma);

  next();
});

module.exports.model = mongoose.model('Account', Account);
