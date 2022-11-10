const Post = require('../models/postModel')
const path = require('path')
const fs = require('fs')

module.exports = async (req, res) => {
    try {
        //check if data exists
        const post = await Post.findOne({
            title: req.body.title,
            userId: req.body.token
        })
        //post exists
        if (post) {
            const coverImage = req.files?.cover
            if (coverImage) {
                //delete previous cover image
                fs.unlink(path.resolve(__dirname, '../uploads/cover_images', post.cover), () => {
                    console.log("image deleted")
                })
                //save new cover image
                coverImage.mv(path.resolve(__dirname, '../uploads/cover_images', coverImage.name), async (err) => {
                    if (err) throw new Error(err)
                    console.log("image uploaded")
                })
            }

            //update the document
            const updatedDoc = await Post.findByIdAndUpdate(post._id, {
                title: req.body?.title || post.title,
                subtitle: req.body?.subtitle || post.subtitle,
                content: req.body?.content || post.content,
                cover: coverImage?.name || post.cover,
                lastUpdated: new Date().getTime()
            })

            if (updatedDoc) {
                return res.status(200).json({
                    success: true,
                    data: updatedDoc.title,
                    message: "Post Updated successfully"
                })
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Couldn't update post. Please try again later"
                })
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "A blog post with this title does not exist"
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