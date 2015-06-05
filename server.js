var http = require("http");

function start(handler) {
  function onRequest(request, response) {
    console.log("Request received.");	
	handler.handle(request, response);			
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start;