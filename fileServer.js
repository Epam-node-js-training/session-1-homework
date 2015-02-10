var url = require("url");
var fs = require('fs');
var path = require('path');

var handleRequest = function(request, response) {
	var pathname = url.parse(request.url).pathname;
	console.log("Request for " + pathname + " received.");
	readFile(pathname, response)
}

var readFile = function(pathname, response){
	var extention = getExtention(pathname);
	if(extention){
		var filename = path.join(__dirname, '.' + pathname);
		path.exists(filename, function(exists) {
        if(!exists) {
            errorHandler(response, pathname);
        }else{
			var file = fs.statSync(filename);
			var mimeType = getMimeForExtention(extention);
			response.writeHead(200, {
				'Content-Type': mimeType,
				'Content-Length': file.size
			});
			var stream = fs.createReadStream(filename);
			stream.pipe(response);
		}
		});
	}else{
		 errorHandler(response, pathname);
	}
}

var errorHandler = function(response, pathname){
	response.writeHead(200, {"Content-Type": "text/plain"});
	if(pathname === '/'){
		response.write('Type link to file');
	}else{
		response.write('Error was found: error during open ' + pathname + '\r\n');
	}
	response.end();
};

var getExtention = function(pathname){
	if(pathname){
		var array = pathname.split('.');
		if(array && array.length > 1){
			return array[array.length - 1];
		}else{
			return null;
		}
	}
	return null;
}

var getMimeForExtention = function(extention){
	var mime = "";
	switch (extention) {
		case "html"	: {
			mime = 'text/html';
			break;
		}
		case "txt" : {
			mime = 'text/plain';
			break;
		}
		case "pdf" : {
			mime = 'application/pdf';
			break;
		}
		default : {
			mime = 'application/octet-stream';
			break;
		}
	}
	return mime;
}

exports.handleRequest = handleRequest;