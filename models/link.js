let mongoose = require('mongoose');

// Link Schema
let linksSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  submitter: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

let Link = module.exports = mongoose.model('Link', linksSchema)
