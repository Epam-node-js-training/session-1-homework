console.log('Running Proserpina HTTP server...');

var server = require('./server');
var FileSystemProvider = require('./fileProvider.js');

var instance = server.createInstance(4242);
var fsp = new FileSystemProvider('./app');

instance.setRouteHandler('/hello', function (path, request, response) {
	response.writeHead(200, { 'Content-Type' : 'text/plain' });
	response.end('This is a sample server application. My name is Proserpina!');
});

instance.setDefaultHandler(function (path, request, response) {
	console.log('Handling the request for file ' + path);
	fsp.getFile(path, function(err, fileReader) {
		if (err !== null) {
			response.writeHead(404, { });
			response.end();
		} else {
			response.writeHead(200, { 'Content-Type': 'text/html' });
			response.end(fileReader());
		}
	});
});

instance.start();
