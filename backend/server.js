const path = require('path')
const connectDatabase = require('./config/database')

if (process.env.NODE_ENV !== 'PRODUCTION')
  require('dotenv').config({ path: path.join(__dirname, 'config/.env') })

const app = require('./app')
//Connect to DB
connectDatabase()

const server = app.listen(process.env.PORT, () => {
  console.log(
    `LISTENING on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  )
})
