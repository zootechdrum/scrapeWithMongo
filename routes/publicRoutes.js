const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = function (app) {
  app.get("/", function (req, res) {
    db.Article.find({})
      .sort({ _id: -1 })
      .then(function (dbBlogs) {
        res.render("index", {
          blogs: dbBlogs,
        });
      });
  });

  app.get("/scrape",  function (req, res) {
    const result = {};
    const crackedArticles = [];
    let arrayIndex = 0;
    axios.get("https://www.cracked.com/").then(function (response) {
      const $ = cheerio.load(response.data);


      $(".content-cards-wrapper").each(function (i, element) {
        // Grabs the title, image and link from cracked
        const title = $(this)
          .children(".content-cards-info")
          .children("h3")
          .children("a")
          .text();
        const link = $(this).children("a").attr("href");
        const image = $(this)
          .children("a")
          .children("picture")
          .attr("data-iesrc");
        const podcast = $(this).hasClass("content-cards-podcast");

        // Save these results in an object that we'll push into the results array we defined earlier
        if (
          link !== undefined &&
          image !== undefined &&
          title !== undefined &&
          podcast === false
        ) 
        {
          console.log(link)
            crackedArticles[arrayIndex] = {title:title,image:image,link:link}
          arrayIndex++
        }
        
            //Second call to axios based on link parameter in results object
            //axios.get(result.link).then(function (response) {
              //var $ = cheerio.load(response.data);

              //$("meta[name='description']").each(function (j, element) {
               // var description = $(this).attr("content");

                //result.description = description;
                  //            db.Article.insertMany(result)
                  //.then(function (dbArticle) {
                   // console.log(i)
                   //if( i + 1 === undefined ){
                     //console.log(i) 
                     //res.redirect('/')
                   //}
                   // console.log(dbArticle)
                    // View the added result in the console
                  //})
                  //.catch(function (err) {
                    // If an error occurred, log it
                    //console.log(err)
               // })
                 }) 
      console.log(crackedArticles)
  })
  })
  // Route for getting all saved Articles from the db
  app.get("/saved", function (req, res) {
    db.Article.find({ saved: true })
      .then(function (savedArt) {
        console.log(savedArt);
        res.render("saved", {
          saved: savedArt,
        });
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

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

  app.delete("/articles", function (req, res) {
    //Delete all the articles from our DB
    db.Article.remove({}).then(function (data) {
      console.log(data);
      res.send(data);
    });
  });

  app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("comment")
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function (req, res) {
    console.log(req.body);
    // Create a new note and pass the req.body to the entry
    db.Comment.create(req.body)
      .then(function (dbComment) {
        console.log(dbComment._id);
        return db.Article.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { comment: dbComment._id } },
          { new: true }
        );
      })

      .then(function (dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  // Mark a Article as having been Saved
  app.put("/markSaved/:id", function (req, res) {
    db.Article.update(
      {
        _id: req.params.id,
      },
      {
        $set: {
          saved: true,
        },
      },
      // When that's done, run this function
      function (error, edited) {
        // show any errors
        if (error) {
          console.log(error);
          res.send(error);
        } else {
          // Otherwise, send the result of our update to the browser
          console.log(edited);
          res.send(edited);
        }
      }
    );
  });
};
