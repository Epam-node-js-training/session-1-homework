var q = require('q');
var fs = require('fs');

module.exports.getContent = function(path) {
    var deferred = q.defer();
    fs.exists('.' + path, function(exists) {
        if (exists) {
            fs.stat('.' + path, function(err, stats) {
                if (err) {
                    console.log(err);
                    deferred.reject(new Error(err));
                }
                if (stats.isFile()) {
                    fs.readFile('.' + path, function(file_err, data) {
                        if (file_err) {
                            console.log(file_err);
                            deferred.reject(new Error(file_err));
                        } 
                        console.log(data);
                        deferred.resolve({
                            type: 'file',
                            data: data
                        });                        
                    });
                }

                if (stats.isDirectory()) {
                    fs.readdir('.' + path, function(dir_err, files) {
                        if (dir_err) {
                            console.log(dir_err);
                            deferred.reject(new Error(dir_err));
                        }
                        console.log(files);
                        deferred.resolve({
                            type: 'directory',
                            data: files
                        });

                    });
                }
            });
        } else {
            deferred.resolve({
                type: 'message',
                data: "Path not exists"
            });
        }
    });
    return deferred.promise;
};