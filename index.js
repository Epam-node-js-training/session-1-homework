var http = require('http');
var fs = require('fs');
var url = require('url');
var eol = require('os').EOL;
var mime = require('mime');

var writeDirectoryContent = function (path, res) {
    res.writeHead(200, { 'Content-Type': 'text-plain' });
    fs.readdirSync(path)
        .forEach(function (name) {
        res.write(name);
        res.write(eol);
    });
    res.end();
};

http.createServer(function (req, res) {
    var path = url.parse(req.url, true).path;
    if (path != '/') {
        if (fs.existsSync(path)) {
            var stat = fs.lstatSync(path);
            if (stat.isFile()) {
                var mimeType = mime.lookup(path);
                res.setHeader('Content-type', mimeType);
                var filestream = fs.createReadStream(path);
                filestream.pipe(res);
            } else {
                writeDirectoryContent(path, res);
            }
        } else {
            res.writeHead(404, { 'Content-Type': 'text-plain' });
            res.end();
        }
    } else {
        writeDirectoryContent(path, res);
    }
}).listen(7000);