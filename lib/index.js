;(function (name, definition) {
    var root = this;
    if (typeof define === 'function' && define.amd) {
        define(name, function() {
            return (root[name] = definition());
        });
    } else {
        window[name] = definition();
    }
})('happy', function() {
    var AdLoader = require('./ad-loader');
    return AdLoader;
});

