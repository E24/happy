var gulp = require('./gulp')([
    'uglify',
    'browserify',
    'js-hint'
]);

gulp.task('default', ['js-hint', 'browserify']);
