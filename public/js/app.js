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
        var $id = $(this).data("id");

        $(".save-note-btn").on("click", function() {
            var $note = $(".modal textarea")
            .val()
            .trim();
            console.log($note);
            console.log($id);
            $.ajax({
            method: "POST",
            url: "/savenote/" + $id,
            data: {
                note: $note
            }
            }).then(function(response) {
                console.log(response);
            });
        });
    });
});