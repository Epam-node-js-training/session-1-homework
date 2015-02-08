var sys = require("sys");
var path = require("path");
var url = require("url");
var fileStr = require("fs");
var m_http = require("http");
var mime = require("mime")

var FileServer = function() {

};

//Creates static file server listed to the specified port.
FileServer.prototype.createServer = function(port) {
  
	m_http.createServer(function(request, response)
	{
		var m_path = unescape(url.parse(request.url).pathname);

		var m_fullPath = path.join(process.cwd(),m_path);
		fileStr.exists(m_fullPath, function(exists)
		{
				if (!exists)
				{
					response.writeHeader(404, {"Content-Type":"text/plain"});	
					response.write("File was not found! " +  m_path);
					response.end();
				}
				else 
				{
					fileStr.lstat(m_fullPath, function(err, stats){
					if (stats.isFile()) {

						console.log("%s is a file, file server may proceed.", m_path);

				    	var m_mime = mime.lookup(m_fullPath);
						console.log("Mime for %s is %s", m_path, m_mime);

						var readFile = fileStr.createReadStream(m_fullPath);
			  			response.writeHeader(200, {"Content-Type":m_mime});
						readFile.pipe(response);
				    } 
				    else if (stats.isDirectory()) 
				    {
				    	console.log("%s is a directory!", m_path);
					    response.writeHead(200, {"Content-Type":"text/plain"});
					    response.write("Please specify correct the file path.");
					    response.end();
					} 
					else 
					{
					    response.writeHead(500, {"Content-Type": "text/plain"});
					    response.write("Internal server error!");
					    response.end();
					}
				}); 	
			}
		});
	}).listen(port);

	console.log("File Server is running on %s port!", port);
};

module.exports = FileServer;

