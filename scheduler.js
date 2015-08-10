var Post = require('./models/post').model;
var moment = require('moment');
var _ = require('underscore');
var Agenda = require('agenda');
var config = require('./config');

var agenda = new Agenda({db: { address: config.agendaConnectionString}});
agenda.define('recalculate scores', function(job, done) {

  Post.find({
    ts_created: {'$gte': moment().subtract(24, 'hours').valueOf() }
  })
  .limit(config.pageCount*10)
  .exec(function(err, posts){
    _.each(posts, function(post){
      // TODO needs a condition here, so we don't have to touch all posts
      post.save();
    });
    console.log('recalculated scores');
    done();
  });

});

//TODO scheduled notifications purge every 30 days

agenda.every(config.scoreRefreshInterval, 'recalculate scores');

module.exports = agenda;

function graceful() {
  agenda.stop(function() {
    process.exit(0);
  });
}

process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);
