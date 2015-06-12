var mime = require('mime');

var isPathToFile = function (path) {
    var splittedPath = path.split('/');
    var last = splittedPath[splittedPath.length - 1];

    return last.indexOf('.') > 0;
};

var createHTMLPage = function (statusCode, path, data) {
    var page = '<!DOCTYPE html><html><head><title>FTP server</title></head><body>';
    var backPath = getBackPath(path);

    if (statusCode === 200) {
        if (path[path.length - 1] !== '/') {
            path += '/';
        }

        if (path !== '/') {
            page += '<p><a href="' + backPath + '">...</a></p>';
        }

        if (data.length) {
            data.forEach(function (item) {
                var _isFile = isPathToFile(item);
                page += '<p><a href="' + path + item + '">';
                if (!_isFile) {
                    page += '/';
                }
                page += item + '</a></p>';
            });
        }
    } else {
        page += statusCode + ':' + data.join(' ');
    }

    page += '</body></html>';

    return page;
};

var setFileResponse = function (response, statusCode, path, file) {
    response.writeHead(statusCode, {"Content-Type": mime.lookup(path)});

    if (file) {
        response.write(file);
    }

    response.end();
};

var setHtmlResponse = function (response, statusCode, path, data) {
    response.writeHead(statusCode, {"Content-Type": "text/html"});
    response.write(createHTMLPage(statusCode, path, data));

    response.end();
};

var getBackPath = function (path) {
    if (path === '/') {
        return path;
    }

    if (path[path.length - 1] === '/') {
        path = path.slice(0, path.length - 1);
    }

    path = path.slice(0, path.lastIndexOf('/'));

    return path || '/';
};

module.exports = {
    isFile: isPathToFile,
    setFileResponse: setFileResponse,
    setHtmlResponse: setHtmlResponse
};

