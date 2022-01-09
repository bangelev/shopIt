const products = require('../data/product.json')
const Product = require('../models/product')
const connectDatabase = require('../config/database')
const mongoose = require('mongoose')
const path = require('path')
const dotenv = require('dotenv')
    // dotenv.config({ path: path.join(__dirname, 'config/.env') })
dotenv.config({ path: 'backend/config/.env' })
const dbUri = process.env.DB_URI
connectDatabase()

const seedDBProducts = async() => {
    try {
        await Product.deleteMany()
        console.log('Products deleted successfully')

        await Product.insertMany(products)
        console.log('Products inserted successfully')
        process.exit()
    } catch (err) {
        console.log(err.message)
        process.exit()
    }
}

seedDBProducts()