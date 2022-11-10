const User = require('../models/userModel')

module.exports = async (req, res) => {
    try {
        //check if data exists
        const user = await User.findOne({
            email: req.body.email
        })
        //user does not exist
        if (!user) {
            const newUser = new User(req.body)
            //hash the user's password
            newUser.hashPassword(req.body.pass)
            await newUser.save().then(data => {
                if (data) {
                    return res.status(200).json({
                        success: true,
                        message: "Account has been created successfully"
                    })
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "Could't create account. Please try again"
                    })
                }
            })
        } else {
            return res.status(400).json({
                success: false,
                message: "Account exists already"
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