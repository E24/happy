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

var onElement = function(selector, cb, cbNotFound) {
    var el = document.querySelector(selector);
console.log(el);
    if (el) {
        cb(el);
    } else if (document.readyState !== 'complete') {
        window.setTimeout(function() { onElement(selector, cb, cbNotFound); }, 10);
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
    onElement: onElement
};
