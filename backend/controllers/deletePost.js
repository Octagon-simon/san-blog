const Post = require('../models/postModel')

module.exports = async (req, res) => {
    try {
        if (req.method == "GET" && req.params?.title && req.params?.token) {
            const post = await Post.findOneAndDelete({
                title : new RegExp(req.params.title, 'i'),
                userId : req.params.token
            })
                if(post){
                    return res.status(200).json({
                        success: true,
                        message: "Post Deleted successfully",
                        post
                    })
                }else{
                    return res.status(400).json({
                        success: false,
                        message: "Couldn't delete post. Please try again"
                    })
                }
        }else{
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