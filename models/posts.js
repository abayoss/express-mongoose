const mongoose = require('mongoose'),
  postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: {type : String, required : true },
    creator: { type: String , required: true}
});

module.exports = mongoose.model('Post', postSchema);
