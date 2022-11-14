const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    username: { type: String, required: true },
    comment: { type: String, required: true }, //can contain summernote stuff?
    datePosted: {
        type: Date,
        default: new Date().getTime()
    }
})

module.exports = mongoose.model('Comment', commentSchema, 'comments')