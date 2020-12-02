'use strict'

const parse_data = data => {
  const movies_text = data.split('\n\n')
  let movies = []
  for (const movie_text of movies_text) {
    // Split the text by lines that separate blocks
    // of data that concerns each movie and then
    // building objects that represent movies
    // from these blocks.
    let movie = movie_text.split('\n').reduce((movie, row) => {
      if (row) {
        const key = formatKeyString(row)
        const value = row.split(': ')[1]
        movie[key] = value
        return movie
      }
    }, {})
    if (movie) {
      movie.releaseYear = parseInt(movie.releaseYear, 10)
      // When adding stars the next line will also check for duplicates
      movie.stars = Array.from(new Set(movie.stars.split(', ')))
      movies.push(movie)
    }
  }
  return movies
}


const formatKeyString = row => {
  const keyString = String(row.split(': ')[0]).replace(/ /g, '')
  return keyString.charAt(0).toLowerCase() + keyString.slice(1)
}

module.exports = { parse_data }
