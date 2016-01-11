'user strict';

var through       = require('through2');
var StreamCounter = require('stream-counter');

module.exports = function(sizeLimit) {
    sizeLimit = sizeLimit || 1000;

    return through.obj(function(file, encoding, next) {
        if (file.isNull()) {
            return next(null, file);
        }

        if (file.isStream()) {
            file.contents.pipe(new StreamCounter())
                .on('error', function() {next(null)})
                .on('finish', function() {
                    return this.bytes <= sizeLimit ? next(null, file) : next(null);
                });

            return;
        }

        return file.contents.length <= sizeLimit ? next(null, file) : next(null);
    });
};
