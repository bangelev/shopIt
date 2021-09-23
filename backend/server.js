if (process.env.NODE_ENV !== 'PRODUCTION')
  require('dotenv').config({ path: 'backend/config/.env' })

const app = require('./app')

const server = app.listen(process.env.PORT, () => {
  console.log(
    `LISTENING on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  )
})
