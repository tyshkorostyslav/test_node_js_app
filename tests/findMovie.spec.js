'use strict'

process.env.NODE_ENV = 'test'

const expect = require('chai').expect
const request = require('supertest')
const mongoose = require('mongoose')

const { app } = require('../src/app')
const { DB_URI } = require('../src/db/index')
const { logger } = require('../src/logging/logger')


// eslint-disable-next-line no-undef
describe('finding movies', function() {
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
  it('finding a movie by title', (done) => {
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
        request(app).get('/find_movie?title=new_movie_from_test')
          .then((res) => {
            const text = res.text
            expect(text).to.equal(
              '["new_movie_from_test"]',
            )
            done()
          }).catch((err) => done(err))
      })
  })

  // eslint-disable-next-line no-undef
  it("not finding a movie by title that doesn't exist", (done) => {
    request(app).get('/find_movie?title=not_new_movie_from_test')
      .then((res) => {
        const text = res.text
        expect(text).to.equal(
          'Such movie doesn\'t exist in database',
        )
        done()
      }).catch((err) => done(err))
  })


  // eslint-disable-next-line no-undef
  it('finding a movie by star', (done) => {
    request(app).get('/find_movie/star?star=q12')
      .then((res) => {
        const text = res.text
        expect(text).to.equal(
          '["new_movie_from_test"]',
        )
        done()
      }).catch((err) => done(err));
  })

  // eslint-disable-next-line no-undef
  it('not finding a movie by star, if star was not filmed anywhere', (done) => {
    request(app).get('/find_movie/star?star=q15')
      .then((res) => {
        const text = res.text
        expect(text).to.include(
          'Such movie doesn\'t exist in database',
        )
        done()
      }).catch((err) => done(err));
  })
})
