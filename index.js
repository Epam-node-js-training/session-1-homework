var http = require('http')
var fs = require('fs')
var path = require('path')
var mime = require('mime')

var server = http.createServer(function (req, res) {
    var filePath = path.resolve(__dirname, "." + req.url);
    var fileStream = fs.createReadStream(filePath)
        .on('end', function () {
            console.log("Read %s file succesfully", filePath)
        })
        .on('error', function (err) {
            sendError(res, 404, "File not found");
        });
    
    var contentType = mime.lookup(filePath);
    res.setHeader('content-type', contentType);
    
    fileStream.pipe(res)
        .on('end', function () {
            console.log("Write %s to response", filePath);
            res.end();
        })
        .on('error', function (err) {
            sendError(res, 500, "Something goes wrong during file writing");
        })
})

function sendError(res, code, message) {
    res.statusCode = code;
    res.setHeader('content-type', 'text/plain');
    res.end(message);
}

server.listen(9001)