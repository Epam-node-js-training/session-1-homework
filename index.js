var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

var server = http.createServer(function(req, res) {
    if(req.method === 'GET' && req.url !== '/') {
        var pathToFile = path.join(process.cwd(), req.url);
        if(fs.existsSync(pathToFile)) {
            res.setHeader('Content-Type', mime.lookup(pathToFile));
            fs.createReadStream(pathToFile).pipe(res);
        }else{
            res.end('This file not exists');
        }
    }else{
        res.end('Hello!');
    }
});

server.listen(3000, function() {
    console.log('listen on port 3000');
});