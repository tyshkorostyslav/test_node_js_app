'use strict'

const mongoose = require('mongoose')

const { app } = require('./app.js');
const { DB_URI } = require('./db/index')
const config = require('config')
const logger = require('./logging/logger.js')

const PORT = config.get('PORT') || 5000

const main = async() => {
  mongoose.connect(DB_URI)
  app.listen(PORT, () => logger.info(`Test app listening on port ${PORT}!`))
}

main()
