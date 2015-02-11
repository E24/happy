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

var nextTick = (function() {
    if (window.Promise) {
        var resolved = Promise.resolve();
        return function(fn) {
            resolved.then(fn);
        };
    }
    else if (window.setImmidiate) {
        return function(fn) {
            setImmidiate(fn);
        };
    }
    else {
        return function(fn) {
            setTimeout(fn, 0);
        };
    }
})();

var onElement = function(selector, cb, cbNotFound) {
    var el = document.querySelector(selector);
    if (el) {
        cb(el);
    } else if (document.readyState !== 'complete') {
        nextTick(function() { onElement(selector, cb, cbNotFound); });
    } else {
        if (typeof(cbNotFound) === 'function') {
            cbNotFound();
        }
    }
};

module.exports = {
    bind: bind,
    attr: attr,
    on: on,
    onElement: onElement,
    nextTick: nextTick
};
