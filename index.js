var http = require('http');
var url = require('url');
var mime = require('mime');
var fs = require('fs');

fileServer = http.createServer(function (req, res) {

    var u = url.parse(req.url, true);

    var filePath = u.path.replace("/", "");

    var onError = function(error, stat){
        if(error){
            res.statusCode = 404;
            res.end("Not Found " + filePath)
        }else{
            res.writeHead(200, {
                'Content-Type': mime.lookup(filePath),
                'Content-Length': stat.size
            });
        }
    };

    var stat = fs.stat(filePath, onError);
    var from = fs.createReadStream(filePath)
        .on('error', onError);

    from.pipe(res);
});


fileServer.listen(8080);