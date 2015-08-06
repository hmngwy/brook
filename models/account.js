var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var validators = require('mongoose-validators');


// TODO compute karma like this
// base = posts+comments
// base + sum_of_votes / base
// we add the base so that min is 1
// we dived the base so that users are encouraged to post quality content
// because the more unworthy content they post the larger the karma divisor
// karma is decreased the more unworthy posts they have

var Account = new Schema({
  votes : { type: Number, default: 0 },
  posts : [ { type: Schema.Types.ObjectId, ref: 'Post' } ],
  posts_commented: [ { type: Schema.Types.ObjectId, ref: 'Post' } ],
  comments : [ { type: Schema.Types.ObjectId, ref: 'Comment' } ],
  upvoted_posts : [ { type: Schema.Types.ObjectId, ref: 'Post' } ],
  upvoted_comments : [ { type: Schema.Types.ObjectId, ref: 'Comment' } ],
  ts_created: { type: Date, default: Date.now },
  role: {type: String, enum: ['super', 'admin', 'editor', 'moderator', 'basic'], default: 'basic' },
  violations: [{ ts_created: {type: Date, default: Date.now, index: false}, message: {type: String, index:false} }],
  notifications: [{ ts_created: {type: Date, default: Date.now, index: false}, message: {type: String, index:false} }]
});

Account.plugin(passportLocalMongoose, {});

module.exports.model = mongoose.model('Account', Account);
