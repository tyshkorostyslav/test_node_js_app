'use strict'

process.env.NODE_ENV = 'test'

const expect = require('chai').expect
const request = require('supertest')
const mongoose = require('mongoose')
const config = require('config')

const TEST_FILE_PATH = config.get('TEST_FILE_PATH')
const { app } = require('../src/app')
const { DB_URI } = require('../src/db/index')
const { logger } = require('../src/logging/logger')


// eslint-disable-next-line no-undef
describe('adding movies from txt file', function() {
  this.timeout(60000)

  // eslint-disable-next-line no-undef
  before((done) => {
    mongoose.connect(DB_URI)
      .then(() => done())
    try {

    } catch (err) {
      logger.error(err)
      done(err)
    }
  })

  // eslint-disable-next-line no-undef
  after((done) => {
    mongoose.connection.dropDatabase()
      .then(() => done())
  })

  // eslint-disable-next-line no-undef
  it('adding movies from txt file', (done) => {
    request(app).post('/from_file')
      .attach('fileName', TEST_FILE_PATH)
      .end((err, res) => {
        if (!err) {
          const body = res.body
          expect(body).to.include('2001 was added to the database.')
          expect(body).to.include('Serenity was added to the database.')
          expect(body).to.include(
            'Raiders of the Lost Ark was added to the database.',
          )
          expect(body).to.include('Jaws was added to the database.')

          done()
        } else {
          done(err)
        }
      })
  })
})
