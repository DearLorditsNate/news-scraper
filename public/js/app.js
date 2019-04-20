$(document).ready(function() {
    var $id;

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
        $("#note-modal").modal("show");
        $id = $(this).data("id");


        // Populate notes
        $.ajax({
            method: "GET",
            url: "/notes/" + $id
        }).then(function(response) {
            console.log(response);
        });
    });

    // Save new note
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
            $(".modal textarea").val("");
            $id = null;
            $("#note-modal").modal("hide");
        });
    });
});