var HttpFileServer = require("./fileServer.js");

var fileServer = //new HttpFileServer();
HttpFileServer.createServer(80, 'localhost');

console.log("FileServer is up and running! \n Waiting for your requests...");
