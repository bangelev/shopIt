const express = require('express')
const errorMiddleware = require('./middlewares/errors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const dotenv = require('dotenv')
const path = require('path')

// Setting up config file
if (process.env.NODE_ENV !== 'production')
    require('dotenv').config({
        path: path.join(__dirname, 'backend/config/.env'),
    })

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())

if (process.env.NODE_ENV === 'PRODUCTION') {
    const root = path.join(__dirname, '../frontend', 'build')
    app.use(express.static(root))

    app.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}

// import all the routes

const products = require('./routes/products')
const auth = require('./routes/auth')
const payment = require('./routes/payment')
const orders = require('./routes/orders')

app.use('/api/v1', products)
app.use('/api/v1', auth)
app.use('/api/v1', payment)
app.use('/api/v1/', orders)

// Middleware to handle errors
app.use(errorMiddleware)

module.exports = app