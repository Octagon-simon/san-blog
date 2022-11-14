const Post = require('../models/postModel')
const User = require('../models/userModel')

module.exports = async (req, res) => {
    try {
        if (req.method == "GET" && req.params?.user) {
            const posts = await Post.find({userId : req.params.user})
            const user = await User.findById(req.params.user)
            const postData = posts?.map(post => {
                return {title : post.title, datePosted : post.datePosted}
            })
                if(user){
                    return res.status(200).json({
                        success: true,
                        message: "Data fetched successfully",
                        totalPosts : postData.length,
                        postData,
                        userData : {
                            username : user.uname,
                            dateJoined : user.date
                        }
                    })
                }else{
                    return res.status(400).json({
                        success: false,
                        message: "User does not exist"
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