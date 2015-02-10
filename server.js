var http = require("http");
var fileServer = require("./fileServer");

function start() {
  function onRequest(request, response) {
    fileServer.handleRequest(request, response);
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start;