var http = require("http");
var url = require("url");
var fs = require("fs");
var mime = require("mime");
var endOfLine = require("os").EOL;
var q = require("q");
var p = require("path");

var rootFolder = ".";
var lstat = q.denodeify(fs.lstat);
var readdir = q.denodeify(fs.readdir);

http.createServer(function(req, resp) {
  
  var path = url.parse(req.url, true).query.url || rootFolder;

  lstat(path).then(function(stat){
    if (stat.isDirectory()){
      writeDir(resp, path);
    } else {
      var mimeType = mime.lookup(path);
      resp.setHeader("Content-Type", mimeType);
      resp.setHeader("Content-disposition", "attachment; filename=" + p.basename(path));
      var stream = fs.createReadStream(path);
      stream.pipe(resp);
    }
  }, function(err) {
    console.log(err);
    writeError(resp, "Path doesn't exists");
  });
  
}).listen(8080);

var writeDir = function(resp, path) {
  readdir(path).then(function(files) {
    var stringBuilder = [];
    stringBuilder.push("Content of '" + path + "' folder: ");
    for(var i = 0, l = files.length; i < l; i++) {
      stringBuilder.push(files[i]);
    }
    writeResponse(resp, 200, "text/plain", stringBuilder.join(endOfLine));
  }, function(err) {
    console.log(err);
    writeError(resp, "Can't read path");
  });
}

var writeError = function(resp, message) {
  writeResponse(resp, 500, "text/plain", message);
};

var writeResponse = function(resp, statusCode, contentType, content) {
  resp.writeHead(statusCode, {"Content-Type": contentType});
  resp.write(content);
  resp.end();
};