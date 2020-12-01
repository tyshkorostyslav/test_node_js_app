'use strict'

// for uploading txt files
const multer = require('multer')

const upload = multer({dest: './uploads/'})

module.exports = { upload }
