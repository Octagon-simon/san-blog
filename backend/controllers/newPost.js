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
        return result;
    } catch (error) {
        console.error(error);
    }
};
module.exports = async (req, res) => {
    try {
        //check if data exists
        const post = await Post.findOne({
            title: req.fields.title
        })
        //post does not exist
        if (!post) {
            const newPost = new Post(req.fields)
            newPost['userId'] = req.fields.token
            //upload using cloudinary
            const imgData = await uploadImage(req.files?.cover.path);

            if (imgData && Object.keys(imgData).length !== 0) {
                newPost['cover'] = JSON.stringify({secure_url : imgData.secure_url, public_id : imgData.public_id})
            }else{
                newPost['cover'] = JSON.stringify({secure_url : 'https://res.cloudinary.com/dxsxxso3a/image/upload/v1668527703/cld-sample-3.jpg', public_id: ''})
            }
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
            // coverImage.mv(path.resolve(__dirname, '../uploads/cover_images', coverImage.name), async (err) => {
            //     if (err) console.log(err)
            //     //add cover parameter to the new Post Object

            // })
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