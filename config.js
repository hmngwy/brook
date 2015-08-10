var config = {};

config.port = process.env.PORT || 7001;

config.agendaConnectionString = process.env.schedulerDbString || 'localhost/tbb';
config.mongoConnectionString = process.env.mongoDbString || 'mongodb://localhost/tbb';
config.siteTitle = "BROOK";
config.pageCount = 10;
config.scoreRefreshInterval = '5 minutes';
config.defaultChannel = 'main';

config.filters = {
  new: { // tag, or tag slug
    name: 'New',
    findByTag: false // using false applies this queries over all tags
    // not defining `queryOpts:` loads defaults
    // i.e. where = {ts_created $lt page} || {}
    // and sort = sort.configDefaultSort
  },
  ask: {
    name: 'Ask',
    findByTag: 'ask',
    pattern: /(^ask\ .+\:.+)|(.+\?$)/i
  },
  show: {
    name: 'Show',
    findByTag: 'show',
    pattern: /(^show\ .+\:.+$)/i
    // TODO make baseFilterMap check this scope for the returned query ops
  }
};

// by default, all filters will be sorted by created date
// you can make filters (that is not new) sort by Rank/score_c by default
// to do that change config.filterDefaultSort to score_c: -1
// you may have to make pagination template changes in index.handlebars
// under the if channelOrFilter block replace the whole if filter block
// with contents of its else block
config.filterDefaultSort = { ts_created: -1 };

config.post_karma_factor = .5; // 50%
config.comment_karma_factor = .1; //  10%

// borrowing from HN, more specifically
// http://www.righto.com/2013/11/how-hacker-news-ranking-really-works.html

// the values here are in "difference" to 1 because of how we compute penalties
// in the research above it's the inverse
// summary: lower the number, higher the penalty
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
