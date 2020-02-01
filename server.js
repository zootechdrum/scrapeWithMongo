// Parses our HTML and helps us find elements
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var axios = require("axios");



axios.get("https://www.cracked.com/").then(function(response) {


  var $ = cheerio.load(response.data);

  // An empty array to save the data that we'll scrape
  var results = [];


$('.content-cards-wrapper').each(function(i, element) {
  
// Grabs the title, image and link from cracked
    var title = $(element).children('.content-cards-info').text()
    var link = $(element).children().attr('href')
    var image = $(element).children().attr("data-original");


    // Save these results in an object that we'll push into the results array we defined earlier
    if(link !== undefined && image !== undefined && title !== undefined){
      results.push({
        link: link,
        image: image,
        title: title
      });
    }
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});
