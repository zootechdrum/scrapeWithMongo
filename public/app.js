$( document ).ready(function() {
// Grab the articles as a json
  $.getJSON("/articles", function(data) {
    console.log(data)

    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $(".content-wrapper").append(
        "<img src = " + data[i].image + " >" +
        "<div class='content-item' ><a data-id= " + data[i]._id + " href= " + data[i].link +  " > " + data[i].title + "</a></div>"
      );
    }
  });
});
{/* <div class="card mb-3" style="max-width: 540px;">
  <div class="row no-gutters">
    <div class="col-md-4">
      <img src="..." class="card-img" alt="...">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
        <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
      </div>
    </div>
  </div>
</div> */}