var Q = require("q");
var http = require("http");
var url = require("url");
var fs = require('fs');
var mime = require('mime');


http.createServer(function (request, response) {
    var pathName = url.parse(request.url).pathname;
    var filePath = __dirname + pathName;
    Q.nfcall(fs.readFile, filePath)
        .then(function (file) {
            var mineType = mime.lookup(filePath);
            response.writeHead(200, {"Content-Type": mineType});
            response.write(file);
            response.end();
        })
        .catch(function (error) {
            console.error('Error: ' + error);
            response.writeHead(404);
            response.end();
        })
        .done();

}).listen(8888);