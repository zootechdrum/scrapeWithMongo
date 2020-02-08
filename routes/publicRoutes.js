const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = function (app) {

    app.get("/", function (req, res) {
        db.Article.find({}).sort({ _id: -1 }).then(function (dbBlogs) {
            res.render("index", {
                blogs: dbBlogs
            });
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
                var podcast = $(this).hasClass("content-cards-podcast")



                // Save these results in an object that we'll push into the results array we defined earlier
                if (link !== undefined && image !== undefined && title !== undefined && podcast === false) {
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

            function redi() {
                res.redirect("/")
            }

            setTimeout(redi, 5000);
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

app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the comments associated with it
      .populate("comment")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
    console.log(req.body)
    // Create a new note and pass the req.body to the entry
    db.Comment.create(req.body)
      .then(function(dbComment) {
          console.log(dbComment._id)
    //     // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
    //     // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
    //     // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { Comment: dbComment._id } }, { new: true });
})
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
}