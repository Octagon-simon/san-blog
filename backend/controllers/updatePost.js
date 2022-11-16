const Post = require('../models/postModel')
const path = require('path')
// Require the cloudinary library
const cloudinary = require('cloudinary').v2;
// Return "https" URLs by setting secure: true
cloudinary.config({
    secure: true
});
/////////////////////////
// Uploads an image file
/////////////////////////
const uploadImage = async (imagePath) => {
    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
    };

    try {
        // Upload the image
        const result = await cloudinary.uploader.upload(imagePath, options);
        //console.log(result);
        return result
    } catch (error) {
        console.error(error);
    }
};

module.exports = async (req, res) => {
    try {
        //check if data exists
        const post = await Post.findOne({
            title: req.fields.old_title,
            userId: req.fields.token
        })
        //post exists
        if (post) {
            const coverImage = req.files?.cover
            let imgData = '';
            if (coverImage){
                //upload to cloudinary
                imgData = await uploadImage(req.files?.cover.path);
                
                //delete cover image
                if(post.cover)
                    await cloudinary.uploader.destroy(JSON.parse(post.cover).public_id, {
                        invalidate : true
                    })
            }

            //update the document
            const updatedDoc = await Post.findByIdAndUpdate(post._id, {
                title: req.fields?.title || post.title,
                subtitle: req.fields?.subtitle || post.subtitle,
                content: req.fields?.content || post.content,
                cover: (imgData) ? JSON.stringify({secure_url : imgData.secure_url, public_id : imgData.public_id}) : post.cover,
                category : req.fields?.category || 'Other',
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