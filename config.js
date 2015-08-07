var config = {};

config.port = 7001;

config.agendaConnectionString = 'localhost/tbb';
config.mongoConnectionString = 'mongodb://localhost/tbb';
config.siteTitle = "Brook";
config.pageCount = 10;
config.scoreRefreshInterval = '5 minutes';
config.defaultChannel = 'main';

config.baseFilterMap = function baseFilterMap(filter, n){
  n = n || false;
  // by default, all filters will be sorted by created date
  // you can make filters (that is not new) sort by score_c by default, to do that
  // in the else statement below change sort to score_c: -1
  // you will have to make pagination template changes in index.handlebars
  // under the if channelOrFilter block replace the whole if filter block
  // with contents of its else block
  var baseWhere = (n) ? {ts_created: {'$lt': n} } : {};
  if(filter=='new') {
    return {
      where: baseWhere,
      sort: { ts_created: -1 }
    }

  // add else if() conditions here to add more complex base filter
  // user new as an example
  } else {
    return {
      where: function(){ baseWhere.filter_tags = filter; return baseWhere; }(),
      sort: { ts_created: -1 }
    }
  }
}
// config.scoreRefreshInterval = '1 seconds';

// borrowing from HN, more specifically
// http://www.righto.com/2013/11/how-hacker-news-ranking-really-works.html

// the values here are in "difference" to 1 because of how we compute penalties
// lower the number, higher the penalty
// e.g. -.4 = less 40%
// this way we can compound penalties
// and award extra scores with positive values
// e.g. 1 = add 100%
config.factorMap = {

  'baiting': -.7,
  'light': -.4, // linkjack, listicle, direct image, etc.
  'no-url': -.4, // obvious
  'controversial': -.7, //flamewars etc
  'satire': -.2,
  'bury': -.9,
  'kill': -1,

  'bump': .5,
  'promote': 1,
  'pin': 10

}

module.exports = config;
