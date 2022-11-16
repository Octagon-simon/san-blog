const Post = require('../models/postModel')
const Comment = require('../models/commentModel.js')

module.exports = async (req, res) => {
    try {
        let title = req.params?.title
        if (req.method == "GET" && title) {
            const post = await Post.findOne({ title: new RegExp(title, 'i') }).populate('userId')
            if (post) {
                const comments = await Comment.find({ postId: post._id });
                //get all posts with thesame categories
                const similarTmp = await Post.find({ category: post.category })
                const similar = []
                await Promise.all(similarTmp.map(async (val, ind) => {
                    //check if the post isnt the one already going to be rendered
                    if (val.id !== post.id) {
                        similar.push({
                            title: val.title,
                            cover: val.cover,
                            content: val.content.substring(0, 200),
                            comments: await Comment.find({ postId: val._id })
                        })
                    }

                }))
                return res.status(200).json({
                    success: true,
                    message: "Post fetched successfully",
                    post,
                    comments,
                    similar,
                })
            } else {
                return res.status(400).json({
                    success: false,
                    message: "A post with this title doesn't exist"
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