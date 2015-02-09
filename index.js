var http = require('http');
var fs = require('fs');
var url = require('url');
var eol = require('os').EOL;
var mime = require('mime');
var Q = require('q');
var readdir = Q.nfbind(fs.readdir);
var lstat = Q.nfbind(fs.lstat);

function dirContent(path, res) {
    readdir(path)
        .then(function (files) {
        res.writeHead(200, { 'Content-Type': 'text-plain' });
        res.write(files.join(eol));
        res.end();
    },
              function (error) {
        res.writeHead(500, { 'Content-Type': 'text-plain' });
        res.write('Could not read from ' + path);
        res.end();
    });
};

function exists_promise(file) {
    var deferred = Q.defer();
    fs.exists(file, function (result) {
        return result ? deferred.resolve(file) 
                      : deferred.reject('invalid file');
    });
    return deferred.promise;
}

function lstat_promise(file) {
    var deferred = Q.defer();
    lstat(file)
        .then(function (result) {
        return result ? deferred.resolve(result) 
                      : deferred.reject('invalid file');
    });
    return deferred.promise;
}

http.createServer(function (req, res) {
    var path = url.parse(req.url, true).path;
    if (path != '/') {
        exists_promise(path)
            .then(lstat_promise)
            .then(function (stat) {
            if (stat.isFile()) {
                var mimeType = mime.lookup(path);
                res.setHeader('Content-type', mimeType);
                var filestream = fs.createReadStream(path);
                filestream.pipe(res);
            } else {
                dirContent(path, res);
            }
        })
            .fail(function (error) {
            res.writeHead(404, { 'Content-Type': 'text-plain' });
            res.end();
        });
    } else {
        dirContent(path, res);
    }
}).listen(7000);