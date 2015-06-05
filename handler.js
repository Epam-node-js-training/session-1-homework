var url = require("url");
var path = require("path");
var fs = require("fs");
var mime = require('mime');

function handle(req, rs) {
	var pathname = "." + url.parse(req.url).pathname;
	
	try {
		var stats = requested(pathname);
	} catch (ex) {
		handleFileNotFound(rs, pathname);
		return
	}
	
	if (stats.isDirectory()) {
		handleDirectory(rs,pathname);
		return;
	}
	
	if (stats.isFile()) {
		handleFile(rs,pathname);
		return;
	}
	handleFileNotFound(req,rs);
}

function requested(pathname) {	
	var stats = fs.lstatSync(pathname);
	return stats;
}

function handleDirectory(rs,pathname){
	fs.readdir(pathname,processFiles);
	function processFiles(err, files) {
		if (err) {
			handleFileNotFound(rs,pathname);
			return;
		}
		rs.writeHead(200, {"Content-Type" : "text/plain"});
		files.forEach(function(file){
			rs.write(file +"\n");
		})
		rs.end();
	}
}

function handleFile (rs,pathname){
	var mimeType = mime.lookup(pathname);
	
	fs.readFile(pathname,processFile);
	function processFile(err, content) {
		if (err) {
			handleFileNotFound(rs,pathname);
			return;
		}
		rs.writeHead(200, {"Content-Type" : mimeType});
		rs.write(content);
		rs.end();
	}
}

function handleFileNotFound(rs,pathname){
	rs.writeHead(404, {"Content-Type": "text/plain"});
    rs.write("Error 404 Path: " + pathname + " not found");
    rs.end();
}

exports.handle = handle;