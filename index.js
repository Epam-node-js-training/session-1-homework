var fs = require('fs'),
url = require('url'),
http = require('http'),
path = require('path'),
ext = require('./extensions.js').ext,
rootDir = "./root";

console.log(ext);

var sendFsData = function(res) {
	return function (err, data) {
		if(err) {
			console.log("Error read file : " + err);
			res.whriteHead(500);
			res.end();
		} else {
			res.writeHead(200);
			console.log(data);
			res.end(data + "");
		}
	};
};

var handler = function(req, res) {
	console.log("Path from request : " + url.parse(req.url).pathname);
	var targetPath = decodeURIComponent(path.normalize(rootDir + "/" + url.parse(req.url).pathname));
	console.log("Path to search : " + targetPath);
	fs.exists( targetPath, function (isExist) {
		if( isExist ) {
			var stat = fs.lstatSync(targetPath);
			if(stat.isDirectory()) {
				fs.readdir( targetPath, sendFsData(res));
			} else if (stat.isFile()) {
				res.setHeader("Content-Type", ext.getContentType(ext.getExt(targetPath)));
				fs.readFile(targetPath, 'utf8',sendFsData(res));
			}
		} else {
			res.writeHead(404, 'text/html');
			res.end("Ups... no file of directory found");
		}
	} );
};

http.createServer(handler).listen(8080);