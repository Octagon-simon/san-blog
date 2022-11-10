const Post = require('../models/postModel')
const path = require('path')

module.exports = async (req, res) => {
    try {
        //check if data exists
        const post = await Post.findOne({
            title: req.body.title
        })
        //post does not exist
        if (!post) {
            const newPost = new Post(req.body)
            newPost['userId'] = req.body.token
            //it is made required by default
            const coverImage = req.files.cover
            coverImage.mv(path.resolve(__dirname, '../uploads/cover_images', coverImage.name), async (err) => {
                if(err) throw new Error(err)
                //add cover parameter to the new Post Object
                newPost['cover'] = coverImage.name
                //store to db
                newPost.save().then(savedDoc => {
                    if (savedDoc) {
                        return res.status(200).json({
                            success: true,
                            message: "Post created successfully"
                        })
                    } else {
                        return res.status(400).json({
                            success: false,
                            message: "Couldn't create post. Please try again later"
                        })
                    }
                })
            })
        } else {
            return res.status(400).json({
                success: false,
                message: "A blog post with this title exists already"
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