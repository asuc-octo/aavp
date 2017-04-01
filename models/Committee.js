var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var committeeSchema = new mongoose.Schema({
  name: { type: String, unique: true},
  members: [{ "type": mongoose.Schema.Types.ObjectId, "ref": "User" }],
  description: String,
  category: String
}, schemaOptions);

var Committee = mongoose.model('Committee', committeeSchema);

module.exports = Committee;
