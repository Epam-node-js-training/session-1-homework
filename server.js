var http = require("http");

function start(handler) {
  function onRequest(request, response) {	
	handler.handle(request, response);			
  }
  http.createServer(onRequest).listen(8888);
}

exports.start = start;