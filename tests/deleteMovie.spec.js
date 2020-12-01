'use strict'

process.env.NODE_ENV = 'test'

const expect = require('chai').expect
const request = require('supertest')
const mongoose = require('mongoose')

const { app } = require('../src/app')
const { DB_URI } = require('../src/db/index')
const { logger } = require('../src/logging/logger')


// eslint-disable-next-line no-undef
describe('deleting movies', function() {
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
  it('deleting 1 movie', (done) => {
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
        request(app).get('/movies')
          .then((res) => {
            const body = res.body;
            expect(body.length).to.equal(1);
            done();
          })
      })
      .then((res) => {
        request(app).delete('/?title=new_movie_from_test')
          .then((res) => {
            const body = res.body;
            expect(body.length).to.equal(
              'Your movie was deleted from the database.',
            )
            done()
          })
      })
      .catch((err) => done(err));
  })
})
