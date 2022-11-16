const User = require('../models/userModel')

module.exports = (req, res) => {
    try {
        User.findOne({ email: req.fields.email }, (err, user) => {
            if (err) new Error(err)
            //check if user exists andn there's no error
            if (user) {
                //compare user's hash with new hash
                if (user.verifyPassword(req.fields.pass)) {
                    return res.status(200).json({
                        success: true,
                        data: user._id,
                        message: "Login Successful"
                    })
                }else{
                    return res.status(401).json({
                        success: false,
                        message: "Invalid Email or Password"
                    })
                }
            } else {
                return res.status(401).json({
                    success: false,
                    message: "Account does not exist"
                })
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "A server error has occured"
        })
    }
}