var http = require('http');
var url = require('url');
var fs = require('fs');
var resHelper = require('./responseHelper');

var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true);

    fs.lstat('.' + parsedUrl.path, function (error, stats) {
        var isFile = stats ? stats.isFile() : resHelper.isFile(parsedUrl.path);

        if (error) {
            // file does not exist
            if (error.code === 'ENOENT') {
                if (isFile) {
                    resHelper.setFileResponse(response, 404, parsedUrl.path);
                } else {
                    resHelper.setHtmlResponse(response, 404, parsedUrl.path, ['No directory ' + parsedUrl.path]);
                }
            }

            return;
        }

        if (isFile) {
            fs.readFile('.' + parsedUrl.path, function (error, fileData) {
                if (error) {
                    resHelper.setFileResponse(response, 404, parsedUrl.path);
                } else {
                    resHelper.setFileResponse(response, 200, parsedUrl.path, fileData)
                }
            });
        } else {
            fs.readdir('.' + parsedUrl.path, function (error, files) {
                if (error) {
                    resHelper.setHtmlResponse(response, 404, parsedUrl.path);
                } else {
                    resHelper.setHtmlResponse(response, 200, parsedUrl.path, files);
                }
            });
        }
    });
});

server.listen(9000);
console.log("Simple server is listening");