$(document).ready(function() {
    $(".save-btn").on("click", function() {
        event.preventDefault();
        $.ajax({
          method: "PUT",
          url: "/save/" + $(this).attr("data-id")
        }).then(function(response) {
          console.log(response);
          window.location = "/"
        });
    });

    $(".delete-btn").on("click", function() {
        event.preventDefault();
        $.ajax({
            method: "DELETE",
            url: "/delete/" + $(this).attr("data-id")
        }).then(function(response) {
            console.log(response);
            window.location = "/saved"
        });
    });

    $(".note-btn").on("click", function() {
        // event.preventDefault();
        $("#note-modal").modal("toggle");
    });
});