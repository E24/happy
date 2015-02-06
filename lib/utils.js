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

var attr = function(elem, attrs) {
    for (var name in attrs) {
        elem.setAttribute(name, attrs[name]);
    }
};

var raf = (window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.msRequestAnimationFrame ||
              function(cb) {
                setTimeout(cb, 1000 / 60);
              });

module.exports = {
    bind: bind,
    attr: attr,
    on: on,
    raf: raf
};
