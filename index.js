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
  res.write('Error 404: Resource not found :(');
  res.end();
}
function sendFile(res, filePath, fileContent) {
  var mimeType = mime.lookup(path.basename(filePath));
  res.writeHead(200, {'Content-Type': mimeType});
  res.end(fileContent);
}
function sendDirList(res, dirPath) {
  fs.readdir(dirPath, function(err, files){
    if (err)
      throw err;
    fileList = '';
    for(var i = 0, len = files.length; i < len; i++) {
      var fileType = mime.lookup(path.basename(files[i]));
      fileList += files[i] + '\n';
    }
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(fileList);
  });
}
function serveStatic(res, absPath) {
  fs.exists(absPath, function(exists) {
    if (!exists) {
      sendNotFoundError(res);
    } else {
      fs.lstat(absPath, function(err, stats){
        if (err)
          throw err;
        if (stats.isFile()) {
          fs.readFile(absPath, function(err, data){
            if (err) {
              sendNotFoundError(res);
            } else {
              sendFile(res, absPath, data);
            }
          });
        } else {
          sendDirList(res, absPath);
        }
      });
    }
  });
}


// Create Http server
var server = http.createServer(function(req, res){
  var filePath = '';
  filePath = fileDir + req.url;
  serveStatic(res, filePath);
});

// Start server
server.listen(appPort, appIp);
console.log('Server running at http://'+appIp+':'+appPort);

// Open app in browser
open('http://'+appIp+':'+appPort, function (err) {
  if (err) throw err;
});