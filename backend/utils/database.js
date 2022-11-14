const mongoose = require('mongoose')

module.exports = async function database() {
    try {
        mongoose.connection.on('open', () => {
            console.log('Database connected')
        })
        //connect to the database 
        await mongoose.connect('mongodb+srv://octagon:sabadilla@sanblog-cluster.ovcidem.mongodb.net/test', {dbName : 'sanBlog'});
    } catch (err) {
        console.log(err)
    }
}