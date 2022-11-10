const Octavalidate = require('octaValidate-nodejs')

//create new instance
const validate = new Octavalidate('form_new_post')

const fieldRules = {
    title : {
        'R' : "Post title is required",
        'TEXT' : "Post title contains invalid characters"
    }
}
module.exports = (req, res, next) => {
    try{
        if(req.method == "GET"){
            const fieldVal = validate.validateFields(fieldRules, req.params)
            //validate the form
            if(!fieldVal){
                return res.status(400).json({
                    success : false,
                    message : "Form validation failed",
                    query: req.params,
                    queryErrors: validate.getErrors()
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