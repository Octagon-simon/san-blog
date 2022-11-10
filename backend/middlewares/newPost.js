const Octavalidate = require('octaValidate-nodejs')

//create new instance
const validate = new Octavalidate('form_new_post')

const fieldRules = {
    title : {
        'R' : "Post title is required",
        'TEXT' : "Post title contains invalid characters"
    },
    subtitle : {
        'R' : "Post subtitle is required",
        'TEXT' : "Post subtitle contains invalid characters"
    },
    content : {
        'R' : "Post content is required"
    },
    token : {
        'R' : "User token is required",
        'ALPHA_NUMERIC' : "Token contains invalid characters"
    }
}

const fileRule = {
    cover : {
        'R' : "Post cover image is required",
        'ACCEPT-MIME' :  "image/*",
        'MAXSIZE' : ['5mb', "Cover image must not exceed 5mb"]
    },
    //summernote file uplaod
    files : {
        'MAXSIZE' : ['5mb', "Uploaded File must not exceed 5mb"]
    }
}

module.exports = (req, res, next) => {
    try{
        if(req.method == "POST"){
            const fileVal = validate.validateFiles(fileRule, req.files)
            const fieldVal = validate.validateFields(fieldRules, req.body)
            //validate the form
            if(!(fileVal && fieldVal)){
                return res.status(400).json({
                    success : false,
                    message : "Form validation failed",
                    formData: req.body,
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