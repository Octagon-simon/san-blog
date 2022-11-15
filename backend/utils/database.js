const mongoose = require('mongoose')

module.exports = async function database() {
    try {
        mongoose.connection.on('open', () => {
            console.log('Database connected')
        })
        //connect to the database 
        await mongoose.connect(process.env.DB_URL, {dbName : 'sanBlog'});
    } catch (err) {
        console.log(err)
    }
}