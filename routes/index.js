const express = require('express')

const router  = express.Router()

router.route('/').get((req, res) => {
    res.send('<h1>Welcome to the Quizmaster API</h1>\
              <p1>API version 1</p>\
              <p1>Juan José Herrera & Samuel Echeverri</>')
})

module.exports = router