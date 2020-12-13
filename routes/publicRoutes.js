const axios = require('axios')
const cheerio = require('cheerio')
const db = require('../models')
const scrapeSite = require('../utils/scrape')
module.exports = function (app) {
    app.get('/', function (req, res) {
        db.Article.find({})
            .sort({ _id: -1 })
            .then(function (dbBlogs) {
                res.render('index', {
                    blogs: dbBlogs,
                })
            })
    })

    app.get('/scrape', async function (req, res) {
        const getArticles = await scrapeSite()
        const saveArticles = await db.Article.create(getArticles)
        res.render('index', {
            blogs: saveArticles,
        })
    })
    // Route for getting all saved Articles from the db
    app.get('/saved', function (req, res) {
        db.Article.find({ saved: true })
            .then(function (savedArt) {
                console.log(savedArt)
                res.render('saved', {
                    saved: savedArt,
                })
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err)
            })
    })

    // Route for getting all Articles from the db
    app.get('/articles', function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({})
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticle)
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err)
            })
    })

    app.delete('/articles', function (req, res) {
        //Delete all the articles from our DB
        db.Article.remove({}).then(function (data) {
            console.log(data)
            res.send(data)
        })
    })

    app.get('/articles/:id', function (req, res) {
        db.Article.findOne({ _id: req.params.id })
            .populate('comment')
            .then(function (dbArticle) {
                res.json(dbArticle)
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err)
            })
    })
    // Route for saving/updating an Article's associated Note
    app.post('/articles/:id', function (req, res) {
        console.log(req.body)
        // Create a new note and pass the req.body to the entry
        db.Comment.create(req.body)
            .then(function (dbComment) {
                console.log(dbComment._id)
                return db.Article.findOneAndUpdate(
                    { _id: req.params.id },
                    { $push: { comment: dbComment._id } },
                    { new: true }
                )
            })

            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle)
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err)
            })
    })
    // Mark a Article as having been Saved
    app.put('/markSaved/:id', function (req, res) {
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
                    console.log(error)
                    res.send(error)
                } else {
                    // Otherwise, send the result of our update to the browser
                    console.log(edited)
                    res.send(edited)
                }
            }
        )
    })
}
