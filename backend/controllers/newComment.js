const Post = require('../models/postModel')
const Comment =require('../models/commentModel')

module.exports = async (req, res) => {
    try {
        //check if post exists
        const post = await Post.findById(req.fields.postId)
        if (post) {
            const newComment = new Comment(req.fields)
            newComment.save().then(savedDoc => {
                if (savedDoc) {
                    return res.status(200).json({
                        success: true,
                        message: "Comment posted successfully"
                    })
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "Couldn't post comment. Please try again later"
                    })
                }
            })
        } else {
            return res.status(400).json({
                success: false,
                message: "The post you're trying to comment on might have been deleted"
            })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "A server error has occured"
        })
    }
}