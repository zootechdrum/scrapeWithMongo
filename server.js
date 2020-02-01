// Parses our HTML and helps us find elements
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var axios = require("axios");



axios.get("https://www.cracked.com/").then(function(response) {


  var $ = cheerio.load(response.data);

  // An empty array to save the data that we'll scrape
  var results = [];


$('.content-cards-wrapper').each(function(i, element) {
  


    var title = $(element).children('a[title]').val()
   // Save the text of the element in a "title" variable
    var image = $('.content-cards-image').attr("data-original");


    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      image: image,
    });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});
