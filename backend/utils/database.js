const mongoose = require('mongoose')

module.exports = async function database() {
    try {
        mongoose.connection.on('open', () => {
            console.log('Database connected')
        })
        //connect to the database 
        await mongoose.connect('mongodb://127.0.0.1:27017', {dbName : 'sanBlog'});
    } catch (err) {
        console.log(err)
    }
}