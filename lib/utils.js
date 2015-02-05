var on = (function(el, ev, callback) {
    if (el.addEventListener) {
        return el.addEventListener(ev, callback, false);
    }
    else {
        return el.attachEvent('on'+ ev, callback);
    }
});

var bind = function(func, obj) {
    if (func.bind) {
        return func.bind(obj);
    }
    else {
        return function() {
            return func.apply(obj, arguments);
        };
    }
};

module.exports = {
    bind: bind,
    on: on
};
