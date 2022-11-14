const Post = require('../models/postModel')
const Comment = require('../models/commentModel')

module.exports = async (req, res) => {
    try {
        if(req.method == "GET"){
            const cat = req.query?.category || '';
            const search = req.query?.search || '';
            let posts = await Post.find({}).populate('userId');

            if(cat){
                posts = await Post.find({ category: cat}).populate('userId')
            }
            if(search){
                posts = await Post.find({title : new RegExp(search, 'i') }).populate('userId')
            }   
            if(cat && search){
                posts = await Post.find({ category: cat, title : new RegExp(search, 'i') }).populate('userId')
            }

            if (posts.length) {
                const output = []

                await Promise.all(posts.map( async (val, ind) => {
                    const comments = await Comment.find({postId : val._id})

                    output.push({
                        _id : val._id,
                        title: val.title,
                        subtitle: val.subtitle,
                        content: val.content,
                        category : val.category,
                        datePosted : val.datePosted,
                        cover : val.cover,
                        comments 
                    })
                }))
               // console.log(output)
                //throw new Error('eee')
                return res.status(200).json({
                    success: true,
                    message: "Posts fetched successfully",
                    posts : output
                })
            } else {
                return res.status(400).json({
                    success: false,
                    message: "No posts found"
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