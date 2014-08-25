// Read settings file
var settings = require('./settings.json');

// Import modules
var http = require('http');
var fs = require('fs');
var open = require('open');
var mime = require('mime');
var path = require('path');

var appPort = settings.port;
var appIp = settings.ip;
var fileDir = settings.file_dir;



// Util functions
function sendNotFoundError(res) {
  res.writeHeader(404, {'Content-Type': 'text/plain'});
  res.write('Error 404: Resource not found :-(');
  res.end();
}
function sendInternalError(res) {
  res.writeHeader(500, {'Content-Type': 'text/plain'});
  res.write('Error 500: Internal server error ;-(');
  res.end();
}
function sendFile(res, filePath, fileContent) {
  var mimeType = mime.lookup(path.basename(filePath));
  res.writeHead(200, {'Content-Type': mimeType});
  res.end(fileContent);
}
function sendDirList(reqPath, res, dirPath) {
  fs.readdir(dirPath, function(err, files){
    if (err)
      sendInternalError(res);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<!DOCTYPE html><html><head><title>' + dirPath + '</title></head>');
    res.write('<body>');
    res.write('<ul>');
    if (reqPath !== '/') {
      reqPath += '/';
    }
    for(var i = 0, len = files.length; i < len; i++) {
      var fileName = files[i].replace(fileDir, '');
      res.write('<li>' + '<a href="' + reqPath + fileName + '">' + fileName + '</a>' + '</li>');
    }
    res.write('</ul>');
    res.write('</body>');
    res.write('</html>')
    res.end();
  });
}
function serveStatic(res, reqPath) {
  var absPath = fileDir + reqPath;
  fs.exists(absPath, function(exists) {
    if (!exists) {
      sendNotFoundError(res);
    } else {
      fs.lstat(absPath, function(err, stats){
        if (err)
          sendInternalError(res);
        if (stats.isFile()) {
          fs.readFile(absPath, function(err, data){
            if (err) {
              sendNotFoundError(res);
            } else {
              sendFile(res, absPath, data);
            }
          });
        } else {
          sendDirList(reqPath, res, absPath);
        }
      });
    }
  });
}


// Create Http server
var server = http.createServer(function(req, res){
  var filePath = '';
  reqPath = req.url;
  serveStatic(res, reqPath);
});

// Start server
server.listen(appPort, appIp);
console.log('Server running at http://'+appIp+':'+appPort);

// Open app in browser
open('http://'+appIp+':'+appPort, function (err) {
  if (err) throw err;
});