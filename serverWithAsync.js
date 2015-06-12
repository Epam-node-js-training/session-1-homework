var http = require('http');
var url = require('url');
var fs = require('fs');
var async = require('async');
var resHelper = require('./responseHelper');

var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true);

    async.waterfall([
        function (next) {
            fs.lstat('.' + parsedUrl.path, function (error, stats) {
                if (error) {
                    next(error, resHelper.isFile(parsedUrl.path));
                } else {
                    next(null, stats.isFile());
                }
            });
        },
        function (isFile, next) {
            var readFunc = isFile ? fs.readFile : fs.readdir;
            var path = '.' + parsedUrl.path;

            readFunc.call(fs, path, function (error, fileData) {
                if (error) {
                    next(error, isFile);
                } else {
                    next(null, isFile, fileData)
                }
            });
        },
        function (isFile, filesData, next) {
            if (isFile) {
                resHelper.setFileResponse(response, 200, parsedUrl.path, filesData);
            } else {
                resHelper.setHtmlResponse(response, 200, parsedUrl.path, filesData);
            }
            next(null);
        }
    ], function (error, isFile) {
        if (error) {
            if (isFile) {
                resHelper.setFileResponse(response, 404, parsedUrl.path);
            } else {
                resHelper.setHtmlResponse(response, 404, parsedUrl.path);
            }
        }

        console.log('request ' + parsedUrl.path + ' ' + error || '');
    });
});

server.listen(9000);
console.log("Async server is listening");