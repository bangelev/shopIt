const express = require('express')
const errorMiddleware = require('./middlewares/errors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())

// import all the routes

const products = require('./routes/products')
const auth = require('./routes/auth')
const orders = require('./routes/orders')

app.use('/api/v1', products)
app.use('/api/v1', auth)
app.use('/api/v1/', orders)

// Middleware to handle errors
app.use(errorMiddleware)

module.exports = app