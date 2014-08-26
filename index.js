console.log('Running Proserpina HTTP server...');

var server = require('./server');
var handlers = require('./handlers.js');

var instance = server.createInstance(4242);

instance.setRouteHandler('/hello', handlers.helloHandler);
instance.setDefaultHandler(handlers.fileHandler);

instance.start();
