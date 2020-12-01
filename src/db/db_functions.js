'use strict'

const logger = require('../logging/logger.js')
const Movie = require('./models/movie')


async function findByStar(starName) {
  try {
    const movie = await Movie.find({ stars: starName }).exec()
    return movie
  } catch (error) {
    logger.error(error)
  }
}

async function movieInDB(movieTitle) {
  try {
    const res = (await Movie.find({title: movieTitle})).length
    return Boolean(res)
  } catch (error) {
    logger.error(error)
    return error
  }
}

module.exports = { findByStar, movieInDB}
