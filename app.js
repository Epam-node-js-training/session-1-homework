var http = require('http');
var url = require('url');
var FilePrinter = require("filePrinter");

var server = http.createServer(function (req, res) {
    console.log('***** NEW REQUEST *****');
    var u = url.parse(req.url, true);
    
   	res.statusCode = 200;

    var startFullPath = __dirname;
    var currentRelativePath = "";

    if ("path" in u.query){
        startFullPath += "/" + u.query.path;
        currentRelativePath = u.query.path + "/";
        console.log(startFullPath);
    }
 
    FilePrinter.listAll(res,startFullPath,currentRelativePath);
 
});

server.listen(8080);
