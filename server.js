var http = require('http');
var fs = require('fs');
var path = require("path");
var url = require("url");
var mime = require("mime");
var folderInfo = require('./my_modules/folder-info.js');

var basepath = "./";

http.createServer(function(req, res) {
  var parsed = url.parse(req.url,true);

  req.on('data', function (chunk) {
    switch(req.url){
      case "/getFilesAndFolders": {
        
        var data =JSON.parse(chunk.toString('utf8'));
        
        folderInfo.getFolderInfo(
          data.url,
          function(folderInfo){
            res.writeHead(200, {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            });
            res.end(JSON.stringify(folderInfo));
          },
          function(err){
            res.writeHead(404);
            return res.end("File not found.");
          }
        )
        break;
      }
      default: {
        res.writeHead(404);
        return res.end("File not found.");
      }
    }
  });

  if (req.method == "GET") {
    if(parsed.path === "/"){
      parsed.path = path.join(parsed.path, "index.html");
    }
    
    var filepath = path.join(basepath, parsed.path);
    
    fs.readFile(filepath, function (err, data){
  		if (err) {
  			res.writeHead(404);
        return res.end("File not found.");
  		}
  		res.setHeader("Content-Type", mime.lookup(filepath));
      res.writeHead(200);
  		res.end(data);
  	});
  }
  
}).listen(8091);