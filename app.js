const express = require('express')
const morgan = require('morgan')
const serveFavicon = require('serve-favicon')
const cors = require('cors')
const sequelize = require('./db/sequelize')
const coworkingRouter = require('./routes/coworkingRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const app = express()
const port = 3001


app
    .use(morgan('dev'))
    .use(serveFavicon(__dirname + '/favicon.png'))
    .use(express.json())
    .use(cors())
    .use('/api/coworking', coworkingRouter)
    .use('/api/user', userRouter)
    .use('/api/review', reviewRouter)
    .listen(port, () => {
        console.log(`L'app sur le port ${port}`)
    })  
w
sequelize.initDb()