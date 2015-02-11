module.exports = function() {
    var watch = require('gulp-watch');

    watch(['./lib/**/*.js'], {
        name: 'Browserify',
    },
    function(events) {
        require('./browserify.js')();
    });
};
