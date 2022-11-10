const Post = require('../models/postModel')

module.exports = async (req, res) => {
    try {
        if (req.method == "GET" && req.params?.title) {
            const post = await Post.findOne({title : new RegExp(req.params.title, 'i')}).populate('userId')
                if(post){
                    return res.status(200).json({
                        success: true,
                        message: "Post fetched successfully",
                        post
                    })
                }else{
                    return res.status(400).json({
                        success: false,
                        message: "A post with this title doesn't exist"
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