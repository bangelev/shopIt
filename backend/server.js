const path = require('path')
const connectDatabase = require('./config/database')
dotenv = require('dotenv')
const app = require('./app')
    // const cloudinary = require('cloudinary')
var cloudinary = require('cloudinary').v2

// if (process.env.NODE_ENV !== 'PRODUCTION')
//   require('dotenv').config({ path: path.join(__dirname, 'config/.env') })

// Handle Uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`ERROR: ${err.stack}`)
    console.log('Shutting down due to uncaught exception')
    process.exit(1)
})
dotenv.config({ path: path.join(__dirname, 'config/.env') })

//set up cloudinary config
cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    })
    //Connect to DB
connectDatabase()

const server = app.listen(process.env.PORT, () => {
        console.log(
            `LISTENING on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
        )
    })
    // Handling the Unhandled Promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`ERROR: ${err.stack}`)
    console.log('Shutting down the server due to unhandled promise rejection')
    server.close(() => {
        process.exit(1)
    })
})