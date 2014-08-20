var fs = require('fs'),
url = require('url'),
http = require('http'),
path = require('path'),
ext = require('./extensions.js').ext,
rootDir = "./root",
appPort = 8080;

var sendServerError = function(err, res) {
	console.log("Error read file : " + err);
	res.whriteHead(500);
	res.end();
};

var sendDirectoryContent = function(path, res) {
	fs.readdir(path, function (err, data) {
		if(err) {
			sendServerError(err, res);
		} else {
			res.writeHead(200, {"Content-Type" : "text/plain charset=utf-8"});
			res.end(data.join("\n"));
		}
	});
};

var sendFileContent = function(path, res) {
	fs.readFile(path, function (err, data) {
		if(err) {
			handleServerError(err, res);
		} else {
			res.writeHead(200, {"Content-Type" : ext.getContentType(ext.getExt(path))});
			res.end(data);
		}
	});
};

var handler = function(req, res) {
	var targetPath = decodeURIComponent(path.normalize(rootDir + "/" + url.parse(req.url).pathname));
	console.log("Path to search : " + targetPath);
	fs.exists( targetPath, function (isExist) {
		if( isExist ) {
			var stat = fs.lstatSync(targetPath);
			if(stat.isDirectory()) {
				sendDirectoryContent(targetPath, res);
			} else if (stat.isFile()) {
				sendFileContent(targetPath, res);
			}
		} else {
			res.writeHead(404, 'text/html');
			res.end("Ups... no file or directory found");
		}
	} );
};

http.createServer(handler).listen(appPort);

