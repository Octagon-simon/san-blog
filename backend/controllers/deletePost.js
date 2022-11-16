const Post = require('../models/postModel')
const Comment = require('../models/commentModel')
// Require the cloudinary library
const cloudinary = require('cloudinary').v2;
// Return "https" URLs by setting secure: true
cloudinary.config({
    secure: true
});
module.exports = async (req, res) => {
    try {
        if (req.method == "GET" && req.params?.title && req.params?.token) {
            const post = await Post.findOneAndDelete({
                title: new RegExp(req.params.title, 'i'),
                userId: req.params.token
            })
            if (post) {
                //delete cover image
                if(post.cover)
                    await cloudinary.uploader.destroy(JSON.parse(post.cover).public_id, {
                        invalidate : true
                    })
                //delete comments
                await Comment.deleteMany({
                    postId: post._id
                })
                return res.status(200).json({
                    success: true,
                    message: "Post Deleted successfully"
                })
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Couldn't delete post. Please try again"
                })
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid request method"
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "A server error has occured"
        })
    }
}