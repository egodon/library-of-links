let mongoose = require('mongoose');

// Link Schema
let articlesSchema = mongoose.Schema({
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

let Article = module.exports = mongoose.model('Link', articlesSchema)
