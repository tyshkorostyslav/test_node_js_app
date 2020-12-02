'use strict'

const logger = require('../logging/logger.js')
const Movie = require('./models/movie')


async function findByTitle(movieTitle) {
  try {
    let regexp = new RegExp("^"+ movieTitle)
    const movie = await Movie.find({ title: regexp }).exec()
    return movie
  } catch (error) {
    logger.error(error)
  }
}

async function findByStar(starName) {
  try {
    let regexp = new RegExp("^"+ starName)
    const movie = await Movie.find({ stars: regexp }).exec()
    return movie
  } catch (error) {
    logger.error(error)
  }
}

async function movieInDB(movieTitle) {
  try {
    const res = (await Movie.find({ title: movieTitle })).length
    return Boolean(res)
  } catch (error) {
    logger.error(error)
    return error
  }
}

async function movieInDBMore(movieTitle, movieReleaseYear, movieStars) {
  try {
    let res = (await Movie.find({
      title: movieTitle,
      releaseYear: movieReleaseYear,
    })).length
    let result = Boolean(res)
    if (result) {
      res = (await Movie.find({
        title: movieTitle,
        releaseYear: movieReleaseYear,
        stars: {$not:
          {$elemMatch:
             {$nin: movieStars}}},
      })).length
      if (res == 0) {
        result = false
      }
    }
    return result
  } catch (error) {
    logger.error(error)
    return error
  }
}

module.exports = { findByTitle, findByStar, movieInDB, movieInDBMore }
