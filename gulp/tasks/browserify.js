var browserify = require('browserify'),
    gulp = require('gulp'),
    glob = require('glob'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    insert = require('gulp-insert'),
    uglify = require('gulp-uglify');

var getBundleName = function () {
    var version = require('../../package.json').version;
    var name = require('../../package.json').name;
    return name + '-' + version;
};

module.exports = function() {
    var bundler = browserify({
        entries: ['./lib/index.js', './lib/async'],
        debug: true
    });

    bundler
        .bundle()
        .pipe(source(getBundleName() + '.min.js'))
        .pipe(buffer())
        .pipe(insert.wrap(';(function(window) { var document=window.document; \n', '\n})(this);'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));
}
