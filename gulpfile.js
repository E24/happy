var gulp = require('./gulp')([
    'uglify',
    'watch',
    'browserify',
    'js-hint'
]);

gulp.task('default', ['js-hint', 'browserify']);
