$(document).ready(function () {
  $(document).on('click', '.deleteArticles-btn', function () {
    var thisId = $(this).attr('data-id')

    // Now make an ajax call for the Article
    $.ajax({
      method: 'DELETE',
      url: '/articles',
    })
      // With that done, add the note information to the page
      .then(function (data) {
        location.reload('index.html')
      })
  })

  $(document).on('click', '.comment-btn', function () {
    var thisId = $(this).attr('data-id')
    console.log(thisId + ' hello')

    // Now make an ajax call for the Article
    $.ajax({
      method: 'GET',
      url: '/articles/' + thisId,
    })
      // With that done, add the note information to the page
      .then(function (data) {
        console.log(data)

        if (data.comment.length === 0) {
          $('.comment-section').empty()
          $('.comment-section').append(
            "<div class='alert alert-warning'>No comments exist for post</div>"
          )
        } else {
          $('.comment-section').empty()
          for (var i = 0; i < data.comment.length; i++) {
            $('.comment-section')
              .append(
                "<p class='comment alert-dark'>" +
                  data.comment[i].body +
                  ' </p>'
              )
              .after('</hr>')
          }
        }
      })
  })

  $(document).on('click', '.write-btn', function () {
    $('.comment-section').empty()

    var thisId = $(this).attr('data-id')

    var input = $(
      "<input class= commentInput type='text' placeholder='Write Comment' required>"
    )
    var submitBtn = $(
      '<div><button data-id=' +
        thisId +
        " class='comment-submit btn btn-info' >Submit</button></div>"
    )
    $('.comment-section').append(input)
    $('.comment-section').append(submitBtn)
  })

  $(document).on('click', '.comment-submit', function () {
    var thisId = $(this).attr('data-id')

    var inputValue = $('.commentInput').val()

    if (!inputValue) {
      return
    }

    $.ajax({
      method: 'POST',
      url: '/articles/' + thisId,
      data: {
        body: inputValue,
        // Value taken from comment textarea
      },
    })
      // With that done
      .then(function (data) {
        $('.comment-section').empty()
        $('.comment-section').append(
          "<div class='alert alert-success'>Comment submitted</div>"
        )
      })
  })

  // When flopy disk is clicked on the article will be marked as saved
  $(document).on('click', '.save-btn', function () {
    console.log($(this).addClass('save-active'))

    var thisId = $(this).attr('data-id')

    $.ajax({
      method: 'PUT',
      url: '/markSaved/' + thisId,
    })
      // With that done
      .then(function (data) {
        console.log(data)
      })
  })
})
