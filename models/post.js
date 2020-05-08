const mongoose = require('mongoose');

let postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    postedBy: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    date: {
        type: Date,
        default: Date.now
      }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;