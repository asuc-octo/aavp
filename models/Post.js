var mongoose = require('mongoose');
var Committee = require('./Committee');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var postSchema = new mongoose.Schema({
  title: String,
  committee: { "type": mongoose.Schema.Types.ObjectId, "ref": Committee },
  body: String
}, schemaOptions);

var Post = mongoose.model('Post', postSchema);

module.exports = Post;