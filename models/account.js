var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var validators = require('mongoose-validators');

var Account = new Schema({
  posts : [ { type: Schema.Types.ObjectId, ref: 'Post' } ],
  posts_commented: [ { type: Schema.Types.ObjectId, ref: 'Post' } ],
  comments : [ { type: Schema.Types.ObjectId, ref: 'Comment' } ],
  upvoted_posts : [ { type: Schema.Types.ObjectId, ref: 'Post' } ],
  upvoted_comments : [ { type: Schema.Types.ObjectId, ref: 'Comment' } ],
  ts_created: { type: Date, default: Date.now },
  role: {type: String, enum: ['super', 'admin', 'editor', 'moderator', 'basic'], default: 'basic' },
  violations: [{type: String}],
  notifications: [{ ts_created: {type: Date, default: Date.now, index: false}, message: {type: String, index:false} }]
});

Account.plugin(passportLocalMongoose, {});

module.exports.model = mongoose.model('Account', Account);
