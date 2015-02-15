var fs = require('fs');
var http = require('http');
var mime = require('mime');
var path = require('path');
var url = require('url');

var HttpFileServer = function() {}

HttpFileServer.createServer = function(port, hostName) {
  var server = http.createServer(handleHttpRequest);
  server.listen(port, hostName);
}

//Request handler
function handleHttpRequest(request, response) {
  var requestedPath = url.parse(request.url).pathname;
  if(requestedPath == undefined ||  requestedPath == "")
    requestedPath = './';
  var absolutePath = path.join(process.cwd(), requestedPath);
  fs.exists(absolutePath, function(exists) {
    if(!exists) {
      send404(response);
    }
    else {
      fs.lstat(absolutePath, function(error, stats) {
        if(error)
          sendServerError(response);

        if (stats.isDirectory())
          sendDirInfo(response, absolutePath);

        else if (stats.isFile()) {
          getFileData(absolutePath, response);
        }
      });
    }
  });
}

//Send index
function sendDirInfo(response, absolutePath) {
  fs.readdir(absolutePath, function(error, fileNames) {
    if (error) {
      sendServerError(response);
    } else {
      response.writeHead(200, {
        'Content-Type': 'application/json'
      });
      response.end(fileNames.toString().split(',').join('\n'));
    }
  });
}

//Return '404'
function send404(response) {
  response.writeHead(404, {
    'Content-Type': 'text/plain'
  });
  response.write('Error 404: The requested directory or file does not exist. Please specify the correct path.');
  response.end();
}

//If error when handling dir or file.
function sendServerError(response) {
  response.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  response.write('Error 500: server error.');
  response.end();
}

/*Send file content to client*/
function sendFile(response, fileData) {
  response.writeHead(200, {
    'Content-Type': fileData.mimeType
  });
  response.end(fileData.fileContent);
}


//Get file contents and its MIME type
function getFileData(absolutePath, response) {
  fs.readFile(absolutePath, function done(error, data) {
    if (error) {
      sendServerError(response);
    }
    else {
      sendFile(response,
       {
        fileContent: data,
        mimeType: getMimeType(absolutePath)
      }
      );
    }
  });
}

//Return MIME type given the path to it
function getMimeType(absolutePath) {
  mime.lookup(path.basename(absolutePath));
}

module.exports = HttpFileServer;
