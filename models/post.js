const mongoose = require('mongoose'),
  postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: {type : String },
    creator: { type: String , required: true}
});

const maxNodeAng = mongoose.connection.useDb('maxNodeAng');

module.exports = maxNodeAng.model('Post', postSchema);
