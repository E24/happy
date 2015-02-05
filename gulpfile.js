var gulp = require('./gulp')([
    'browserify',
    'js-hint'
]);

gulp.task('default', ['js-hint', 'browserify']);
