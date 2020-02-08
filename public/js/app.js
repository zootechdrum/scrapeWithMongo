$(document).ready(function () {
  // Grab the articles as a json
  $.getJSON("/articles", function (data) {
    console.log(data)

    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $(".content-wrapper").append(
        "<img src = " + data[i].image + " >" +
        "<div class='content-item' ><a data-id= " + data[i]._id + " href= " + data[i].link + " > " + data[i].title + "</a></div>"
      );
    }
  });



  $(document).on("click", ".comment-btn", function () {
    
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function (data) {
        console.log(data);

      });
  });


$(document).on("click", ".write-btn", function () {
 $('.comment-section').empty()
    
  var thisId = $(this).attr("data-id");

  var input = $("<input class= commentInput type='text' value='Write Comment'>")
  var submitBtn = $("<div><button data-id=" + thisId + " class='comment-submit btn btn-info' >Submit</button></div>")
  $(".comment-section").append(input)
  $(".comment-section").append(submitBtn)

  });


$(document).on("click", ".comment-submit", function () {
  var thisId = $(this).attr("data-id");

    $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      body: $(".commentInput").val()
      // Value taken from comment textarea
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
    });
   });
 });