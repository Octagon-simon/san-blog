const mongoose = require('mongoose')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    uname : {required: true, type: String},
    email : {required : true, type: String},
    profile: {type : String},
    hash : {required : true, type: String},
    salt : {required : true, type: String},
    date: {required : true, type: String, default : new Date().getTime()},
})

userSchema.methods.hashPassword = function(pass){
    this.salt = crypto.randomBytes(16).toString('hex')
    //hash the user's salt and password with 1000 iterations
    this.hash = crypto.pbkdf2Sync(pass, this.salt, 1000, 64, 'sha512').toString('hex')
}

userSchema.methods.verifyPassword = function(pass) {
    const hash = crypto.pbkdf2Sync(pass, this.salt, 1000, 64, 'sha512').toString('hex')
    //compare and return 
    return this.hash === hash;
}

//create model
module.exports = mongoose.model('User', userSchema, 'users')