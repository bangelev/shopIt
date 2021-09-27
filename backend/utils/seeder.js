const products = require('../data/product.json')
const Product = require('../models/product')
const connectDatabase = require('../config/database')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: 'backend/config/.env' })

connectDatabase()

const seedDB = async () => {
  try {
    await Product.deleteMany()
    console.log('Products deleted successfully')

    await Product.insertMany(products)
    console.log('Products inserted successfully')
    procces.exit()
  } catch (err) {
    console.log(err.message)
    process.exit()
  }
}
