$( document ).ready(function() {
// Grab the articles as a json
  $.getJSON("/articles", function(data) {
    console.log(data)

    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $(".content-wrapper").append(
         "<div class='content-item' ><a data-id= " + data[i]._id + "" + ' href= '+ data[i].link +  ">" + data[i].title + "</a></div>");
    }
  });
});