import dotenv from 'dotenv'

// injecting `.env` file into `process.env`
dotenv.config()

module.exports = require('./src/index')
