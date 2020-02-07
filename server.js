var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

var exphbs = require("express-handlebars");




app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Require all models
var db = require("./models");
var PORT = 3000;

// Initialize Express
var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));

mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true });


// Routes
require("./routes/publicRoutes")(app)




// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});


