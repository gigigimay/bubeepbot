const dotenv = require('dotenv')

// eslint-disable-next-line no-global-assign
require = require('esm')(module /* , options */)

dotenv.config()

module.exports = require('./src/index')
