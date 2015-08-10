var config = require('./config');

var getBaseWhere = function getBaseWhere(paginate) {
  paginate = paginate || false;
  return (paginate) ? {ts_created: {'$lt': paginate} } : {};
}

var defaultQueryOpts = function defaultQueryOpts(filter, baseWhere){
  if(filter!==false) {
    baseWhere.filter_tags = filter;
  }
  return {
    where: baseWhere,
    sort: config.filterDefaultSort
  }
}

module.exports = function buildQueryParams(filter, n){
  if(config.filters[filter]) {
    var selectedFilter = config.filters[filter];
    if(config.filters[filter].queryOpts) {
      return defaultQueryOpts(selectedFilter.findByTag, getBaseWhere(n));
    } else {
      return defaultQueryOpts(selectedFilter.findByTag, getBaseWhere(n));
    }
  } else {
    return {}
    // 404?
    //var error = new Error('Page not found')
    //error.status = 404;
    //throw error;
  }
}
