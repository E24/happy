var on = function(el, ev, callback) {
    if (el.addEventListener) {
        on = function(el, ev, callback) {
            return el.addEventListener(ev, callback, false);
        };
    }
    else {
        on = function(el, ev, callback) {
            return el.attachEvent('on'+ ev, callback);
        };
    }
    on(el, ev, callback);
};

var off = function(el, ev, callback) {
    if (el.addEventListener) {
        off = function(el, ev, callback) {
            return el.removeEventListener(ev, callback);
        };
    }
    else {
        off = function(el, ev, callback) {
            return el.dettachEvent('on'+ ev, callback);
        };
    }
    off(el, ev, callback);
};

var bind = function(func, obj) {
    if (func.bind) {
        bind = function(func, obj) {
            return func.bind(obj);
        };
    }
    else {
        bind = function(func, obj) {
            return function() {
                return func.apply(obj, arguments);
            };
        };
    }
    return bind(func, obj);
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

var extend = function (obj, props) {
    for(var prop in props) {
        if(props.hasOwnProperty(prop)) {
            obj[prop] = props[prop];
        }
    }

    return obj;
};

module.exports = {
    bind: bind,
    attr: attr,
    on: on,
    off: off,
    onElement: onElement,
    nextTick: nextTick,
    extend: extend
};
