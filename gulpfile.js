var gulp = require('./gulp')([
    'uglify',
    'test',
    'watch',
    'browserify',
    'js-hint'
]);

gulp.task('default', ['js-hint', 'browserify']);
