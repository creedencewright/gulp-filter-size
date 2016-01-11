'user strict';

var through       = require('through2');
var StreamCounter = require('stream-counter');

var DEFAULT_MIN_SIZE = 0;
var DEFAULT_MAX_SIZE = 1000;

module.exports = function(sizeLimit) {
    var sizeMin, sizeMax;

    if (typeof sizeLimit === 'number') {
        sizeMax = sizeLimit;
    } else if (typeof sizeLimit === 'object') {
        sizeMin = sizeLimit.min || DEFAULT_MIN_SIZE;
        sizeMax = sizeLimit.max || DEFAULT_MAX_SIZE;
    } else {
        sizeMax = DEFAULT_MAX_SIZE;
    }

    return through.obj(function(file, encoding, next) {
        if (file.isNull()) {
            return next(null, file);
        }

        if (file.isStream()) {
            file.contents.pipe(new StreamCounter())
                .on('error', function() {next(null)})
                .on('finish', function() {
                    return _check(sizeMin, sizeMax, this.bytes) ? next(null, file) : next(null);
                });

            return;
        }

        return _check(sizeMin, sizeMax, file.contents.length) ? next(null, file) : next(null);
    });
};

function _check(min, max, size) {
    return size >= min && size <= max;
}