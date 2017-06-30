let deleteLink = $(document).ready(function() {
  $('.delete-article').on('click',function(e) {
      var $target = $(e.target);
      const id = ($target.attr('data-id'));

      $.ajax({
        type: 'DELETE',
        url: "https://api.mlab.com/api/1/databases/linklib/collections/links/" + id + "?apiKey=L9_WEqfVS1SaIdZ5mfToatlnrUtbM2pV",
        timeout: 300000,
        async: true,
        success: function(response) {
            window.location.href='/';
        },
        error: function (err) {
          console.log(err);
          console.log("Delete Error");
        }
      })
  });
});

export default deleteLink;