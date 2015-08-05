var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Post = require('./post');
var Account = require('./account');

var deepPopulate = require('mongoose-deep-populate');
var validators = require('mongoose-validators');

var restful = require('node-restful');

var Comment = new Schema({
  body:   { type: String, validate: [validators.isLength({}, 10, 512)] },
  ts_created: { type: Date, default: Date.now },
  responses: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  // cid: { type: Schema.Types.ObjectId, ref: 'Comment' },
  pid: { type: Schema.Types.ObjectId, ref: 'Post' },
  op: { type: Schema.Types.ObjectId, ref: 'Account' }
});

Comment.plugin(deepPopulate, {
  populate: {
    'responses': {},
    'op': {}
  }
});

// post save
// add id to parent.replies
// add id to account.replies

// module.exports = mongoose.model('Comment', Comment);
module.exports.model = restful.model('Comment', Comment);
module.exports.schema = Comment;
