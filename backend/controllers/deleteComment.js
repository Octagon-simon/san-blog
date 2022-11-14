const Post = require('../models/postModel')
const Comment = require('../models/commentModel')
module.exports = async (req, res) => {
    try {
        if (req.method == "GET" && req.params?.commentId && req.params?.postId && req.params?.token) {
            const post = await Post.findOne({
                _id: req.params.postId,
                userId: req.params.token
            });
            //check if post exists and it belongs to the user
            if (post) {
                const comment = await Comment.findOneAndDelete({
                    postId: post._id,
                    _id: req.params.commentId
                })
                if (comment) {
                    return res.status(200).json({
                        success: true,
                        message: "Comment Deleted successfully"
                    })
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "Couldn't delete comment. Please try again"
                    })
                }
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Couldn't find post. Please try again"
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