'use strict'

process.env.NODE_ENV = 'test'

const expect = require('chai').expect
const request = require('supertest')
const mongoose = require('mongoose')

const { app } = require('../src/app')
const { DB_URI } = require('../src/db/index')
const { logger } = require('../src/logging/logger')


// eslint-disable-next-line no-undef
describe('finding data about movies', function() {
  this.timeout(40000)

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
  it('finding data about the movie', (done) => {
    request(app).post('/')
      .send(
        {
          title: 'new_movie_from_test',
          format: 'DVD',
          releaseYear: 2020,
          stars: ['star24', 'act48', 'q12'],
        },
      )
      .then((res) => {
        request(app).get('/about_movie?title=new_movie_from_test')
          .then((res) => {
            const text = res.text
            expect(text).to.include(
              '"title":"new_movie_from_test","releaseYear":2020,"format":"DVD"',
            )
            done()
          }).catch((err) => done(err))
      })
  })

  // eslint-disable-next-line no-undef
  it("not finding data about the movie, that doesn't exist", (done) => {
    request(app).get('/about_movie?title=not_new_movie_from_test')
      .then((res) => {
        const text = res.text
        expect(text).to.equal(
          'There is no such movie in the database',
        )
        done()
      }).catch((err) => done(err))
  })

})
