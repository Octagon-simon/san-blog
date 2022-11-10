const Post = require('../models/postModel')

module.exports = async (req, res) => {
    try {
        if (req.method == "GET") {
            const posts = await Post.find({}).populate('userId')
                if(posts){
                    return res.status(200).json({
                        success: true,
                        message: "Posts fetched successfully",
                        posts
                    })
                }else{
                    return res.status(400).json({
                        success: false,
                        message: "Posts fetched successfully"
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