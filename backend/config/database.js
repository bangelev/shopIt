const mongoose = require('mongoose')
const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: 'backend/config/.env' })

// const dbUri = process.env.DB_URI

const connectDatabase = () => {
    mongoose
        .connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then((con) => {
            console.log(`CONNECTED TO MONGODB with  ${con.connection.host}`)
        })
}

module.exports = connectDatabase