var http = require('http');
var url = require('url');

function ServerInstance(port) {
	this.port = port;
	this.routeHandlers = {};
	this.defaultHandler = defaultHandler;
}

function defaultHandler(path, request, response) {
	console.log('Running default handler for ' + path);
	response.writeHead(200, { 'Content-Type': 'text/plain' });
	response.end('');		
}

function serverHandler(request, response) {
	var path = url.parse(request.url).pathname;
	console.log('path is ' + path);
	console.log(this.routeHandlers);
	if (this.routeHandlers[path] !== undefined && this.routeHandlers[path] !== null) {
		var handler = this.routeHandlers[path];
		handler(path, request, response);
	} else {
		this.defaultHandler(path, request, response);
	}
}

ServerInstance.prototype.start = function () {
	var self = this;
	var server = http.createServer(function (request, response) {
		var path = url.parse(request.url).pathname;
		if (self.routeHandlers[path] !== undefined && self.routeHandlers[path] !== null) {
			var handler = self.routeHandlers[path];
			handler(path, request, response);
		} else {
			self.defaultHandler(path, request, response);
		}
	});
	server.listen(this.port, 'localhost');
};

ServerInstance.prototype.setRouteHandler = function(path, handler) {
	this.routeHandlers[path] = handler;
};

ServerInstance.prototype.setDefaultHandler = function(defaultHandler) {
	this.defaultHandler = defaultHandler;
};

exports.createInstance = function (port) {
	return new ServerInstance(port);
};
