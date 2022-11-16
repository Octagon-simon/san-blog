const Octavalidate = require('octavalidate-nodejs')

//create new instance
const validate = new Octavalidate('form_register')

const fieldRules = {
    uname : {
        'R' : "Your username is required",
        'USERNAME' : "Your username contains invalid characters"
    },
    email : {
        'R' : "Your email is required",
        'EMAIL' : "Your email address is invalid"
    },
    pass : {
        'R' : "Your password is required",
        'MINLENGTH' :[8, "Your password must have a minimum of 8 characters"]
    }
}
module.exports = (req, res, next) => {
    try{
        if(req.method == "POST"){
            //validate the form
            if(!validate.validateFields(fieldRules, req.fields)){
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