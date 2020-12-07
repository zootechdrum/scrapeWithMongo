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
const lengthOfArticleArry = crackedArticles.length
let arrTracker = 0; 
      getDescription()
      function getDescription(){
    if(arrTracker < lengthOfArticleArry){
      axios.get(crackedArticles[arrTracker].link).then((response) => {
     const $ = cheerio.load(response.data)
      const description = $("meta[name='description']").attr("content")
      crackedArticles[arrTracker].description = description
        arrTracker++
        getDescription()
      })
        
    }else {return crackedArticles}
      }
    })
}
module.exports = scrapeSite;
