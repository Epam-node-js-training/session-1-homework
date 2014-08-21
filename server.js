var http = require('http');
var url = require('url');
var mime = require('mime');
var reader = require('./my_modules/content_reader.js');

var server = http.createServer(function(req, res) {
    var u = url.parse(req.url, true);
    console.log(u.pathname);    
    reader.getContent(u.pathname).then(function(result) {
        console.log(result);
        switch (result.type) {
            case "directory":
                res.writeHead(200, {
                    'Content-type': 'text/plain;charset=utf-8'
                });
                res.write("Direcory content:\n");
                for (var i = 0; i < result.data.length; i++) {
                    res.write(result.data[i] + "\n");
                }
                res.end();
                break;
            case "file":                
                res.writeHead(200, {
                    'Content-type': mime.lookup('.' + u.pathname) + ';charset=utf-8'
                });
                res.end(result.data);
                break;
            default:
                res.writeHead(404, {
                    'Content-type': 'text/plain;charset=utf-8'
                });
                res.end();
                break;
        }
    });    
});

server.listen(1337, function() {
    console.log("Listening port: " + server.address().port);
});