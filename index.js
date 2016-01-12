'user strict';

var through       = require('through2');
var StreamCounter = require('stream-counter');

module.exports = function(sizeLimit) {
    var sizeMin = 0, sizeMax;

    if (typeof sizeLimit === 'number') {
        sizeMax = sizeLimit;
    } else if (typeof sizeLimit === 'object') {
        sizeMin = sizeLimit.min || sizeMin;
        sizeMax = sizeLimit.max || 0;
    } else {
        return next(null, file);
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
    if (!max || min >= max) {
        return size >= min;
    };

    return size >= min && size <= max;
}