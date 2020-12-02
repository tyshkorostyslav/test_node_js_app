'use strict'

process.env.NODE_ENV = 'test'

const expect = require('chai').expect
const request = require('supertest')
const mongoose = require('mongoose')

const { app } = require('../src/app')
const { DB_URI } = require('../src/db/index')
const { logger } = require('../src/logging/logger')


// eslint-disable-next-line no-undef
describe('getting movies', function() {
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
  it('getting movies', (done) => {
    request(app).get('/movies')
      .then((res) => {
        const body = res.body;
        expect(body.length).to.equal(0);
        done();
      })
      .catch((err) => done(err));
  });

  // eslint-disable-next-line no-undef
  it('getting 1 movie', (done) => {
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
      .catch((err) => done(err));
  })

  // eslint-disable-next-line no-undef
  it('adding 1 movie with duplicate stars', (done) => {
    request(app).post('/')
      .send(
        {
          title: 'new_movie_with_duplicate_stars',
          format: 'DVD',
          releaseYear: 2020,
          stars: ['star24', 'star24', 'q12', 'q12', 't48'],
        },
      )
      .then((res) => {
        request(app).get('/about_movie?title=new_movie_with_duplicate_stars')
          .then((res) => {
            const stars = res.body[0].stars;
            expect(stars.length).to.equal(3);
            done();
          })
      })
      .catch((err) => done(err));
  })

  // eslint-disable-next-line no-undef
  it('failing to add a movie that has existing title', (done) => {
    request(app).post('/')
      .send(
        {
          title: 'new_movie_from_test',
          format: 'q11',
          releaseYear: 2020,
          stars: ['star24', 'act48', 'q12'],
        },
      )
      .then((res) => {
        const text = res.text;
        expect(text).to.equal(
          'Movie with title new_movie_from_test already exists',
        )
        done();
      })
      .catch((err) => done(err));
  })

  // eslint-disable-next-line no-undef
  it('failing to add a movie that has wrong format', (done) => {
    request(app).post('/')
      .send(
        {
          title: 'new_movie_2_from_test',
          format: 'q11',
          releaseYear: 2020,
          stars: ['star24', 'act48', 'q12'],
        },
      )
      .then((res) => {
        const text = res.text;
        expect(text).to.equal(
          // eslint-disable-next-line max-len
          'Wrong format in {"title":"new_movie_2_from_test","format":"q11","releaseYear":2020,"stars":["star24","act48","q12"]}, please, try one more time.',
        )
        done();
      })
      .catch((err) => done(err));
  })

  // eslint-disable-next-line no-undef
  it('failing to add a movie that has wrong year', (done) => {
    request(app).post('/')
      .send(
        {
          title: 'new_movie_2_from_test',
          format: 'DVD',
          releaseYear: 1800,
          stars: ['star24', 'act48', 'q12'],
        },
      )
      .then((res) => {
        const text = res.text;
        expect(text).to.equal(
          // eslint-disable-next-line max-len
          'Wrong year in {"title":"new_movie_2_from_test","format":"DVD","releaseYear":1800,"stars":["star24","act48","q12"]}, please, try one more time.',
        )
        done();
      })
      .catch((err) => done(err));
  })

  // eslint-disable-next-line no-undef
  it('failing to add a movie that has not enough data', (done) => {
    request(app).post('/')
      .send(
        {
          title: 'new_movie_3_from_test',
          format: 'DVD',
          stars: ['star24', 'act48', 'q12'],
        },
      )
      .then((res) => {
        const text = res.text;
        expect(text).to.equal(
          // eslint-disable-next-line max-len
          'Wrong data in {"title":"new_movie_3_from_test","format":"DVD","stars":["star24","act48","q12"]}, please, try one more time.',
        )
        done();
      })
      .catch((err) => done(err));
  })
})
