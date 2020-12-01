'use strict'

const mongoose = require('mongoose')

const movieSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  releaseYear: {
    type: Number,
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
  stars: {
    type: [String],
    required: true,
  },
})

module.exports = mongoose.model('Movie', movieSchema)
