var fs = require('fs');
var path = require("path");

module.exports.getFolderInfo = function(folderPath, callbackSuccess, callbackError) {
    var root = "./";
    
    if (typeof folderPath !== "undefined") {
        if (folderPath !== "") {
            root = folderPath;
        }
    }
    fs.readdir(root, function(err, files) {
        if (err) {
            callbackError(err);
        }

        var data = [];

        if (root !== "./") {
            var parentDir = "";
            if(root.lastIndexOf("/") !== -1){
                parentDir = root.substr(0, root.lastIndexOf("/"));
            }else{
                parentDir = root.substr(0, root.lastIndexOf("\\"));
            }

            var statsDir = fs.statSync(path.join("./", parentDir));
            statsDir.name = "...";
            statsDir.path = parentDir;
            statsDir.isDirectory = true;

            data.push(statsDir);
        }

        files.map(function(file) {
            return path.join(root, file);
        }).forEach(function(file) {
            var stats = fs.statSync(file);

            stats.name = path.basename(file);
            stats.path = file;
            stats.isDirectory = stats.isDirectory();

            data.push(stats);
        });
        
        callbackSuccess(data);
    });
}