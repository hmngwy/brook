var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Account = require('./account');

var validators = require('mongoose-validators');

var restful = require('node-restful');
var moment = require('moment');
var _ = require('underscore');

var config = require('../config');

var Post = new Schema({
  channel:    { type: String, default: 'main', validate: [validators.isAlphanumeric()] },
  filters:    [{ type: String }],

  flags:      [{ type: String }],

  score_c:    { type: Number, index: true },
  score:      { type: Number, index: true },
  votes:      { type: Number, default: 0 },

  op:         { type: Schema.Types.ObjectId, ref: 'Account' },
  title:      { type: String, required: true, validate: [validators.isAscii(), validators.isLength({skipEmpty: true}, 5, 128)] },
  url:        { type: String, default: '', validate: [validators.isURL({ protocols: ['http','https'], require_tld: true, skipEmpty: true })] },
  body:       { type: String, default: '', validate: [validators.isLength({skipEmpty: true}, 10, 512)] },

  comments :  [ { type: Schema.Types.ObjectId, ref: 'Comment' } ],
  direct_comments :  [ { type: Schema.Types.ObjectId, ref: 'Comment' } ], //for rendering

  ts_created: { type: Date, default: Date.now, index: true },
});

// post save
// add id to account.posts
Post.pre('save', function(next){

  // compute score here, modularize for agenda later
  var actualVotes = this.votes;

  // a comment is 1/5 the worth of a vote
  var commentBump = this.comments.length / 7;
  actualVotes += commentBump;

  // smaller the number, higher the penalty
  var penalties = _.map(this.flags, function(num){
    return config.factorMap[num];
  });
  penalties = _.reduce(penalties, function(memo, num){ return memo + num; }) || 0;
  // console.log(penalties, 'penalties');

  // descent rate
  var gravity = 1.8;

  // time factor in hours, should it be minutes?
  var hoursSince = moment().diff(this.ts_created, 'hours');
  var timebase = 2;

  // borrowing from HN, more specifically
  // http://www.righto.com/2013/11/how-hacker-news-ranking-really-works.html
  var scoreDetail = (
    Math.pow(actualVotes, .8) /
    Math.pow(hoursSince + timebase, gravity)
  ) * (1 + penalties);

  var accuracy = 10000;
  var scoreRound = Math.round(scoreDetail * accuracy);

  this.score = scoreRound;

  this.score_c = parseFloat(scoreRound.toString() + '.' + this.ts_created.getTime().toString());

  console.log('score recomputed for', this._id, this.score);
  console.log(this.score_c);

  next();
  // next();
});

// module.exports = mongoose.model('Post', Post);
module.exports.model = restful.model('Post', Post);
module.exports.schema = restful.model('Post', Post);
