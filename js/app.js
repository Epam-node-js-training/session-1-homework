(function() {
    var getFilesAndFolders = function(url) {
        $(".table-data").html("Loading...");
        $.ajax({
            url: "getFilesAndFolders",
            type: "POST",
            data: JSON.stringify({url : url}),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(data) {
                console.log("Success getFilesAndFolders");
                $(".table-data").html(TemplateManager.get("js/tmpls/view-tmpl.html")({
                    data: data
                }));

                addHandlers();
            },
            error: function() {
                console.log("Error getFilesAndFolders");
                $(".table-data").html("Error");
            }
        });
    };

    var addHandlers = function() {
        $(".path").click(function(e) {
            getFilesAndFolders($(this).attr("path"));
            return false;
        });
    };

    getFilesAndFolders();

})();