var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Channel = new Schema({
  slug:  { type: String, required: true },
  name:   { type: String, required: true },
  filters: [ { slug: {type: String, required: true}, name: {type: String, required: true}, expression: {type: String, required: true} } ]
});

module.exports = mongoose.model('Channel', Channel);
