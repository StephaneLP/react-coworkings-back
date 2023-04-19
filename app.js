const express = require('express')
const morgan = require('morgan')
const serveFavicon = require('serve-favicon')
const sequelize = require('./db/sequelize')
const coworkingRouter = require('./routes/coworkingRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const app = express()
const port = 3001

const cors = require('cors');
app.use(cors({
    origin: 'https://www.section.io'
}));

app
    .use(morgan('dev'))
    .use(serveFavicon(__dirname + '/favicon.png'))
    .use(express.json())
    .use('/api/coworking', coworkingRouter)
    .use('/api/user', userRouter)
    .use('/api/review', reviewRouter)
    .listen(port, () => {
        console.log(`L'app sur le port ${port}`)
    })  

sequelize.initDb()