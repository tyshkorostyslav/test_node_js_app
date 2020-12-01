'use strict'

const config = require('config')

const IP = config.get('IP') || 'localhost'
const PORT = config.get('PORT') || 5000

const URL = 'http://' + IP + ':' + PORT

const question = {
  type: '',
  name: '',
  message: '',
  default: '',
}

question.type = 'input'
question.name = 'data'
const inputQuestion = Object.assign({}, question)

question.type = 'list'
question.name = ''
question.choices = []
const listQuestion = Object.assign({}, question)

module.exports = { URL, inputQuestion, listQuestion }
