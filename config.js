var config = {};

config.port = 7001;

config.agendaConnectionString = 'localhost/tbb';
config.mongoConnectionString = 'mongodb://localhost/tbb';
config.siteTitle = "Brook";
config.pageCount = 20;
config.scoreRefreshInterval = '5 minutes';
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
