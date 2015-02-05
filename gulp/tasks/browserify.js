var browserify = require('browserify'),
    gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify');

var getBundleName = function () {
    var version = require('../../package.json').version;
    var name = require('../../package.json').name;
    return name + '-' + veversion;
};

module.exports = function() {
    var bundler = browserify({
        entries: ['./lib/'+getBundleName()+'.js'],
        debug: true
    });

    bundler
        .bundle()
        .pipe(source(getBundleName() + '.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));
}
