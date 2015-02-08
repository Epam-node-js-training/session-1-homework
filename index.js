var sys = require("sys");
var FileServer = require("./fileServer.js");

sys.puts("Hello, this is my first Lab on Node.js!");

var server = new FileServer();
server.createServer(8080);