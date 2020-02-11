require("dotenv").config();
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
const exphbs = require("express-handlebars");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();


app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Require all models
// var db = require("./models");
var PORT = process.env.PORT || 3001;



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// || "mongodb://localhost/scraper"

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper" ;

mongoose.connect("mongodb://webScraper:cesar2183790@ds163480.mlab.com:63480/heroku_spqg6bvf" , { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true });


// Routes
require("./routes/publicRoutes")(app)




// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});


