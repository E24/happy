module.exports = function() {
    var mochify = require('mochify'),
        gulp   = require('gulp');

    gulp.task('test', function() {
        mochify({
            repoter: 'spec'
        }).bundle();
    });
}
