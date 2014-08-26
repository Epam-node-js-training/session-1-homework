var FileSystemProvider = require('./fileProvider.js');
var fsp = new FileSystemProvider('./app');

module.exports.helloHandler = function (path, request, response) {
	response.writeHead(200, { 'Content-Type' : 'text/plain' });
	response.end('This is a sample server application. My name is Proserpina!');
};

module.exports.fileHandler = function (path, request, response) {
	console.log('Handling the request for file ' + path);
	fsp.getFile(path, function(err, fileReader) {
		if (err !== null) {
			response.writeHead(404, { });
			response.end();
		} else {
			fsp.getMimeType(path, function(resolvedMime) {
				console.log('resolved mime : ' + resolvedMime);
				if (resolvedMime) {
					response.writeHead(200, { 'Content-Type': resolvedMime });
				}
				response.end(fileReader());
			});
		}
	});
};
