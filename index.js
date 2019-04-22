const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const expressJWT = require('express-jwt')

//routes
const authorRoutes = require('./routes/AuthorRoutes')
const bookRoutes = require('./routes/BookRoutes')
const publisherRoutes = require('./routes/PublisherRoutes')
const userRoutes = require('./routes/UserRoutes')
const loginRoutes = require('./routes/LoginRoutes')


const ApiError = require('./models/ApiError')
const { webPort, logger } = require('./config/config')

const port = process.env.PORT || webPort  //port uit env variable, anders uit config


let app = express() //express app

//Cors permissions systeem gebruiken
app.use(cors())

// post request inhoud
app.use(bodyParser.urlencoded({
    'extended': 'true'
}))

//x-www-form-urlencoded
app.use(bodyParser.json()); 
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})) 

// loggen
app.use(morgan('dev'))

//mongodb



if (process.env.NODE_ENV == 'testCloud' || process.env.NODE_ENV == 'production') {
    mongoose.connect('mongodb://csideuser22:test123@cluster0-shard-00-00-ko2vb.mongodb.net:27017,cluster0-shard-00-01-ko2vb.mongodb.net:27017,cluster0-shard-00-02-ko2vb.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',
        { useNewUrlParser: true });
} else if (process.env.NODE_ENV !== 'test') {
    mongoose.connect('mongodb://localhost/localbased',
        { useNewUrlParser: true });
}






// Routes
app.use('/api', loginRoutes)
app.use('/api', userRoutes)
app.use('/api', authorRoutes)
app.use('/api', bookRoutes)
app.use('/api', publisherRoutes)

// als er geen endpoint gevonden wordt, laat error zien 
app.use('*', function (req, res, next) {
     logger.error('Endpoint not found')
    const error = new ApiError('The requested endpoint is not available', 404)
    next(error)
})

// Catch-all error handler according to Express documentation - err should always be an ApiError! 
// See also http://expressjs.com/en/guide/error-handling.html
app.use((err, req, res, next) => {
    logger.error(err)
    res.status((err.code || 404)).json(err).end()
})

// begin met luisteren naar requests op de gewenste port
app.listen(port, () => {
    logger.info('Server running on port ' + port)
})

// export de app 
module.exports = app
