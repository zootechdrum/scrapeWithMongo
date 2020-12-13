require('dotenv').config()
const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require('axios')
const cheerio = require('cheerio')

// Initialize Express
const app = express()

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Require all models
// const db = require("./models");
const PORT = process.env.PORT || 3001

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// Make public a static folder
app.use(express.static('public'))

// Configure middleware
// Use morgan logger for logging requests
app.use(logger('dev'))
// || "mongodb://localhost/scraper"

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/scraper', {
    useCreateIndex: true,
    useNewUrlParser: true,
})

// Routes
require('./routes/publicRoutes')(app)
//try to hide pw

// Start the server
app.listen(PORT, function () {
    console.log('App running on port ' + PORT + '!')
})
