var mime = require('mime');
var fs = require('fs');

function FileProvider(initialPath) {
	this.initialPath = initialPath;
}

function createFileReader(data) {
	return function() {
		return data;
	};
}

FileProvider.prototype.getFile = function(path, doneCallback) {
	var filePath = this.initialPath + path;
	fs.realpath(filePath, function (err, resolvedPath) {
		if (err) {
			doneCallback('Path ' + filePath + ' is not exits.', null);
		} else {
			fs.readFile(resolvedPath, function(err, data) {
				if (err) {
					doneCallback('Unable to open file ' + filePath + '.');
				} else {
					doneCallback(null, createFileReader(data));
				}
			});
		}
	});
};

FileProvider.prototype.getMimeType = function(path, doneCallback) {
	var filePath = this.initialPath + path;
	fs.realpath(filePath, function (err, resolvedPath) {
		if (err) {
			doneCallback(null);
		} else {
			doneCallback(mime.lookup(filePath));
		}
	});
};

module.exports = FileProvider;
