'use strict'

// function which perform logic in cli
const arg = require('arg')
const inquirer = require('inquirer')
const fs = require('fs')
const FormData = require('form-data')

const axios = require('axios')
const { URL, inputQuestion, listQuestion } = require('./cli_objects')


function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--yes': Boolean,
      '-y': '--yes',
    },
    {
      argv: rawArgs.slice(2),
    },
  )
  return {
    action: args._[0],
  }
}


async function promptForMissingOptions(options) {
  const defaultAction = 'List all movies';
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.action || defaultAction,
    }
  }

  const questions = [];
  if (!options.action) {
    questions.push({
      type: 'list',
      name: 'action',
      message: 'Please, choose which action to do with the Movies database',
      choices: [
        'Add a movie',
        'Delete a movie',
        'Show all data about a movie',
        'List all movies',
        'Find a movie by title',
        'Find a movie by star',
        'Add all movies from text file',
      ],
      default: defaultAction,
    })
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    action: options.action || answers.action,
  };
}


async function promptForActions(options) {
  const questions = []

  if (options.data) {

    if (options.action === 'Find a movie by title') {

      try {
        const requestString = URL + '/find_movie?title=' + options.data
        const response = await axios.get(requestString)
        console.log(response.data)
      } catch (err) {
        console.log(err)
      }

    } else if (options.action === 'Find a movie by star') {

      try {
        const requestString = URL + '/find_movie/star?star=' + options.data
        const response = await axios.get(requestString)
        console.log(response.data)
      } catch (err) {
        console.log(err)
      }
      return {}

    } else if (options.action === 'Delete a movie') {

      try {
        const requestString = URL + '/?title=' + options.data
        const response = await axios.delete(requestString)
        console.log(response.data)
      } catch (err) {
        console.log(err)
      }
      return {}

    } else if (options.action === 'Add all movies from text file') {

      try {
        const requestString = URL + '/from_file'

        await fs.readFile(
          options.data, async(err, data) => {
            if (!err) {
              let formData = new FormData()
              formData.append('fileName', data, 'fileName')
              const response = await axios.post(requestString, formData, {
                headers: {
                  // eslint-disable-next-line quote-props
                  'accept': 'application/json',
                  'Accept-Language': 'en-US,en;q=0.8',
                  // eslint-disable-next-line max-len
                  'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                },
              })
              console.log(response.data)
            } else {
              console.log(err)
            }
          })
      } catch (err) {
        console.log(err)
      }
      return {}

    } else if (options.action === 'Show all data about a movie') {

      try {
        const requestString = URL + '/about_movie?title=' + options.data
        const response = await axios.get(requestString)
        console.log(response.data)
      } catch (err) {
        console.log(err)
      }
      return {}

    }

  } else if (options.title) {

    try {
      const requestString = URL + '/'
      const body = {
        title: options.title,
        releaseYear: options.releaseYear,
        format: options.format,
        stars: options.stars.split(', '),
      }
      const response = await axios.post(requestString, body)
      console.log(response.data)
    } catch (err) {
      console.log(err)
    }
    return {}


  } else {

    if (options.action === 'List all movies') {

      try {
        const requestString = URL + '/movies'
        const response = await axios.get(requestString)
        console.log(response.data)
      } catch (err) {
        console.log(err)
      }
      return {}

    } else if (options.action === 'Find a movie by title') {

      inputQuestion.message = 'Please enter the title of a movie'
      questions.push(Object.assign({}, inputQuestion))

    } else if (options.action === 'Find a movie by star') {

      inputQuestion.message =
      'Please, enter name of a star who was filmed in this movie'
      questions.push(Object.assign({}, inputQuestion))

    } else if (options.action === 'Delete a movie') {

      inputQuestion.message = 'Please, enter name of a movie you want to delete'
      questions.push(Object.assign({}, inputQuestion))

    } else if (options.action === 'Add all movies from text file') {

      // eslint-disable-next-line max-len
      inputQuestion.message = 'Please, enter the path of file from which you what to load movies'
      questions.push(Object.assign({}, inputQuestion))

    } else if (options.action === 'Show all data about a movie') {

      // eslint-disable-next-line max-len
      inputQuestion.message = 'Please, enter the title of a movie you want to know about'
      questions.push(Object.assign({}, inputQuestion))

    } else if (options.action === 'Add a movie') {

      // eslint-disable-next-line max-len
      inputQuestion.message = 'Please, enter the title of a movie you want to add'
      inputQuestion.name = 'title'
      questions.push(Object.assign({}, inputQuestion))

      inputQuestion.message = 'Please, enter the year of release'
      inputQuestion.name = 'releaseYear'
      questions.push(Object.assign({}, inputQuestion))

      listQuestion.message = 'Please, enter the format of the moie'
      listQuestion.name = 'format'
      listQuestion.choices = ['DVD', 'VHS', 'Blu-Ray']
      questions.push(Object.assign({}, listQuestion))

      inputQuestion.message =
      'Please, enter the names of the stars who were filmed in this movie'
      inputQuestion.name = 'stars'
      questions.push(Object.assign({}, inputQuestion))
    }
  }


  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    action: options.action || answers.action,
    data: options.data || answers.data,
    title: options.title || answers.title,
    releaseYear: options.releaseYear || answers.releaseYear,
    format: options.format || answers.format,
    stars: options.stars || answers.stars,
  }
}

module.exports = {
  parseArgumentsIntoOptions,
  promptForMissingOptions,
  promptForActions,
}
