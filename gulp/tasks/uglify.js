module.exports = function() {
    var gulp = require('gulp'),
        uglify = require('gulp-uglify');

    gulp.task('uglify', function() {
      gulp.src('./lib/*.js')
        .pipe(uglify())
    });
};
