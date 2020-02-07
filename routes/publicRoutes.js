const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = function (app) {

    app.get("/", function (req, res) {
        db.Article.find({}).sort({ _id: -1 }).then(function (dbNews) {
            res.render("index");
        });
    });

app.get("/scrape", function (req, res) {
    axios.get("https://www.cracked.com/").then(function (response) {
      var $ = cheerio.load(response.data);
  
      $('.content-cards-wrapper').each(function (i, element) {
        var result = {};
  
        // Grabs the title, image and link from cracked
        var title = $(this).children('.content-cards-info').children('h3').children('a').text()
        var link = $(this).children('a').attr('href')
        var image = $(this).children('a').attr('data-original')
  
        // Save these results in an object that we'll push into the results array we defined earlier
        if (link !== undefined && image !== undefined && title !== undefined) {
            result.title = title,
            result.link = link,
            result.image = image,
  
        //Second call to axios based on link parameter in results object
        axios.get(result.link).then(function (response) {
  
          var $ = cheerio.load(response.data);
  
          $("meta[name='description']").each(function (i, element) {
  
            var description = $(this).attr("content")
  
            result.description = description
  
  
            db.Article.insertMany(result)
              .then(function (dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
              })
              .catch(function (err) {
                // If an error occurred, log it
                console.log(err);
              });
        })
        })
  
      }
      });
  
      res.send("Scrape Complete");
    })
  })
  
  // Route for getting all Articles from the db
  app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function (dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

}