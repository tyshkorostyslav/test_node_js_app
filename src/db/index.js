'use strict'

const config = require('config')

const MONGODB_PWORD = config.get('MONGODB_PWORD')
const MONGODB_DBNAME = config.get('MONGODB_DBNAME')
const MONGODB_TEST_DBNAME = config.get('MONGODB_TEST_DBNAME')


let DB_URI = 'mongodb+srv://dbUser:' +
  MONGODB_PWORD +
  '@cluster0.u7ujh.mongodb.net/'


if (process.env.NODE_ENV === 'test') {
  DB_URI += MONGODB_TEST_DBNAME + '?retryWrites=true&w=majority'
} else {
  DB_URI += MONGODB_DBNAME + '?retryWrites=true&w=majority'
}

module.exports = { DB_URI }
