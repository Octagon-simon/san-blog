const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    content: { type: String, required: true },
    category : {
        type : String,
        default : "Other"
    },
    datePosted: {
        type: Date,
        default: new Date().getTime()
    },
    files : {
        type : String
    },
    lastUpdated : {
        type: String
    },
    cover: { type: String }
})
//handle summernote file upload
module.exports = mongoose.model('Post', postSchema, 'posts')