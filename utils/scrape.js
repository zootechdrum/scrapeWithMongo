const axios = require("axios");
const cheerio = require("cheerio");
const scrapeSite = () => {
    const result = {};
    const crackedArticles = [];
    
    //We need arrayIndex to correctly add to crackedArticles 
    // THe loop will sometimes skip a card which leaves i in our each loop useless. 
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
            crackedArticles[arrayIndex] = {title:title,image:image,link:link}
          arrayIndex++
        }
			}) 
    }).then(() => {
                console.log(crackedArticles) 
for(article of crackedArticles){
  console.log(article.link)
}     
//axios.get(result.link).then(function (response) {
   //var $ = cheerio.load(response.data);
                                                                
//m  $("meta[name='description']").each(function (j, element) {odule.exports = scrapeSite
  //   var description = $(this).attr("content");
                                                                
  //   result.description = description;
//                   db.Article.insertMany(result)
    //   .then(function (dbArticle) {
        // console.log(i)
      //  if( i + 1 === undefined ){
          //console.log(i) 
          //res.redirect('/')
        //}
         //console.log(dbArticle)
         // View the added result in the console
      // })
       //.catch(function (err) {
         // If an error occurred, log it
         //console.log(err)
    // })
      })
}

module.exports = scrapeSite;
