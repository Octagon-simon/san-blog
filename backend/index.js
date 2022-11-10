const express = require('express')
const path = require('path')
const fileUpload = require('express-fileUpload')
const cors = require('cors')
const db = require('./utils/database')
const app = express()
const PORT = process.env.PORT || 5000

//parse url encoded bodies (as sent by html forms)
app.use(express.urlencoded({ extended: true }))
//parse json bodies (as sent by api clients)
app.use(express.json())
app.use(fileUpload())

app.use('/public', express.static('./uploads'))

const corsOpts = {
    origin : "*",
    optionsSuccessStatus: 200
}

app.use(cors(corsOpts))

app.get('/', (req, res) => {
    return res.status(200).json({
        message : "🙂 Hello 🙂"
    })
})

//routes
app.use('/register', require('./middlewares/register'), require('./controllers/register'))

app.use('/login', require('./middlewares/login'), require('./controllers/login'))

app.use('/new-post', require('./middlewares/newPost'), require('./controllers/newPost'))

app.use('/update-post', require('./middlewares/updatePost'), require('./controllers/updatePost'))

app.use('/posts', require('./controllers/allPosts'))

app.get('/post/:title', require('./middlewares/singlePost'), require('./controllers/singlePost'))

app.get('/post/delete/:title/:token', require('./middlewares/deletePost'), require('./controllers/deletePost'))

app.use((req, res) => {
    res.status(400).json({
        message: "page not found"
    })
})
app.listen(PORT, () => {
    console.log(`App is live on ${PORT}`);
    db();
})