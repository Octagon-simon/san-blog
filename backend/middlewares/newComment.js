const Octavalidate = require('octavalidate-nodejs')

//create new instance
const validate = new Octavalidate('form_new_comment')

const fieldRules = {
    username : {
        'R' : "Your username is required",
        'USERNAME' : "Your username is invalid"
    },
    comment : {
        'R' : "Your comment is required",
        'TEXT' : "Your comment contains invalid characters"
    },
    postId : {
        'R' : "Post ID is required",
        'ALPHA_NUMERIC' : "PostID contains invalid characters"
    }
}

module.exports = (req, res, next) => {
    try{
        if(req.method == "POST"){
            const fieldVal = validate.validateFields(fieldRules, req.fields)
            //validate the form
            if(!fieldVal){
                return res.status(400).json({
                    success : false,
                    message : "Form validation failed",
                    formData: req.fields,
                    formErrors: validate.getErrors()
                })
            }
        }else{
            return res.status(400).json({
                success : false,
                message : "Invalid request method"
            })
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success : false,
            message : "A server error has occured"
        })
    }
    //next middeware
    next();
}