var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var committeeSchema = new mongoose.Schema({
  name: String,
  members:[{ "type": Schema.Types.ObjectId, "ref": "User" }],
  description: String

}, schemaOptions);

var Committee = mongoose.model('Committee', committeeSchema);

module.exports = Committee;
