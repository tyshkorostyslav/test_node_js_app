'use strict'

const path = require('path')
const fs = require('fs')
const config = require('config')
const express = require('express')

const START_YEAR = config.get('START_YEAR')
const FINISH_YEAR = config.get('FINISH_YEAR')
const GOOD_FORMATS = config.get('GOOD_FORMATS')
const { findByTitle, findByStar, movieInDB, movieInDBMore } = require('./db/db_functions')
const { parse_data } = require('./utils/txt_parsing')
const { upload } = require('./utils/upload')
const logger = require('./logging/logger.js')
const Movie = require('./db/models/movie')


const app = express()
app.use(express.json())
app.use(express.urlencoded())


app.post('/', async(req, res) => {
  logger.info('post request was called')
  res.send(await addMovie(req.body))
})


app.post('/from_file', upload.single('fileName'), async(req, res) => {
  logger.info('from_file request was called')
  let file = req.file
  const filePath = path.resolve(file.path)
  await fs.readFile(filePath, {encoding: 'utf-8'}, async(err, data) => {
    if (!err) {
      let result = []
      const movies = await parse_data(data)
      for (const movie of movies) {
        result.push(await addMovie(movie, res))
      }
      res.send(result)
    } else {
      logger.error(err)
      res.send(
        'Some error happened, while reading the file, please, try later.',
      )
    }
  })
})


app.delete('/', async(req, res) => {
  logger.info('delete request was called')
  if (req.query.title) {
    if (await movieInDB(req.query.title)) {
      try {
        // As we check that the movie is unique by title when adding,
        // we can be completely sure, that the first movie found is
        // the one we need to delete
        await Movie.deleteOne({title: req.query.title}).exec()
        res.send('Your movie was deleted from the database.')
      } catch (error) {
        logger.error(error)
        res.send('Some error happened, please, try later.')
      }
    } else {
      logger.error({
        message: 'There is no such movie in the database',
        data: req.query.title,
      })
      res.send('There is no such movie in the database')
    }
  } else {
    logger.error({
      message: 'Wrong data',
      data: req,
    })
    res.send('Wrong data, please, try one more time.')
  }
})


app.get('/movies', async(req, res) => {
  try {
    // collation is needed to sort case insensitive
    const movies = await Movie.find()
      .collation({locale: 'en', strength: 2})
      .sort({title: 1})
      .exec()
    res.json(Array.from(movies, movie => movie.title))
  } catch (error) {
    logger.error(error)
    res.send('Some error happened, please, try later.')
  }
})

app.get('/about_movie', async(req, res) => {
  logger.info('about_movie request was called')
  if (req.query.title) {
    if (await movieInDB(req.query.title)) {
      try {
        res.send(await Movie.find({title: req.query.title}))
      } catch (error) {
        logger.error(error)
        res.send('Some error happened, please, try later.')
      }
    } else {
      logger.error({
        message: 'There is no such movie in the database',
        data: req.query.title,
      })
      res.send('There is no such movie in the database')
    }
  } else {
    logger.error({
      message: 'Wrong data',
      data: req.query.title,
    })
    res.send('Wrong data, please, try one more time.')
  }
})


app.get('/find_movie', async(req, res) => {
  logger.info('find_movie request was called')
  if (req.query.title) {
    try {
      const movies = await findByTitle(req.query.title)
      if (movies.length) {
        res.json(Array.from(movies, movie => movie.title))
      } else {
        res.send("Such movie doesn't exist in database")
      }
    } catch (error) {
      logger.error(error)
      res.send('Some error happened, please, try later.')
    }
  } else {
    logger.error({
      message: 'Wrong data',
      data: req.query.title,
    })
    res.send('Wrong data, please, try one more time.')
  }
})


app.get('/find_movie/star', async(req, res) => {
  logger.info('find_movie/star request was called')
  if (req.query.star) {
    try {
      const movies = await findByStar(req.query.star)
      if (movies.length) {
        res.json(Array.from(movies, movie => movie.title))
      } else {
        res.send("Such movie doesn't exist in database")
      }
    } catch (error) {
      logger.error(error)
      res.send('Some error happened, please, try later.')
    }
  } else {
    logger.error({
      message: 'Wrong data',
      data: req.query.title,
    })
    res.send('Wrong data, please, try one more time.')
  }
})


const addMovie = async(movieObj) => {
  if (
    ('title' in movieObj) &&
  ('releaseYear' in movieObj) &&
  ('stars' in movieObj) &&
  (await movieInDBMore(movieObj.title, movieObj.releaseYear, movieObj.stars))
  ) {
    logger.error({
      message: 'Movie with this title already exists',
      data: movieObj,
    })
    return 'Movie with title ' + movieObj.title + ' already exists'
  } else if (
    ('format' in movieObj) && !(GOOD_FORMATS.includes(movieObj.format))
  ) {
    logger.error({
      message: 'Wrong format',
      data: movieObj,
    })
    // eslint-disable-next-line max-len
    return 'Wrong format in ' + JSON.stringify(movieObj) + ', please, try one more time.'
  } else if (
    ('releaseYear' in movieObj) &&
    (
      (movieObj.releaseYear > FINISH_YEAR) ||
      (movieObj.releaseYear < START_YEAR)
    )
  ) {
    logger.error({
      message: 'Wrong year',
      data: movieObj,
    })
    // eslint-disable-next-line max-len
    return 'Wrong year in ' + JSON.stringify(movieObj) + ', please, try one more time.'
  } else if (
    ('title' in movieObj) &&
    ('releaseYear' in movieObj) &&
    ('format' in movieObj) &&
    ('stars' in movieObj)
  ) {
    const movie = new Movie({
      title: movieObj.title,
      releaseYear: movieObj.releaseYear,
      format: movieObj.format,
      stars: Array.from(new Set(movieObj.stars)), // preserving only unique names of stars here
    })
    try {
      await movie.save()
      return movieObj.title + ' was added to the database.'
    } catch (error) {
      logger.error(error)
      // eslint-disable-next-line max-len
      return 'Some error happened while trying to add ' + movieObj + ', please, try later.'
    }
  } else {
    logger.error({
      message: 'Wrong data',
      data: movieObj,
    })
    // eslint-disable-next-line max-len
    return 'Wrong data in ' + JSON.stringify(movieObj) + ', please, try one more time.'
  }
}


module.exports = { app }
