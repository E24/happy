var bind = require('./utils').bind;

var Request = function(config) {
    this.config = config;
    this.load();
};

Request.prototype = {
    ajax: function() {
        var self = this,
            request;

        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
        } else {
            request = new global.ActiveXObject("MSXML2.XMLHTTP.3.0");
        }
        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                if (self.config.onLoad) {
                    self.config.onLoad.call(self, request.responseText);
                }
            } else {
                if (self.config.onError) {
                    self.config.onError.call(self);
                }
            }
        };

        request.open((self.config.method || 'GET'),self.config.url, true);
        request.send();
    },
    jsonp: function() {
        var script = document.createElement('script'),
            url = this.config.url,
            callback = this.config.callback || 'callback',
            method = 'jsonPCallback';
        
        if (url.indexOf('?') === -1) {
            url += '?';
        } else {
            url += '&';
        }
        url += callback +'='+ method;
        
        window[method] = bind(function(data) {
            console.log(data);
            this.config.onLoad.call(this, data);
        }, this);
        
        script.onerror = this.config.onError;
        script.src = url;

        document.body.appendChild(script);
    },
    load: function() {
        if (this.config.jsonp) {
            this.jsonp();
        } else {
            this.ajax();
        }
    }
};

module.exports = Request;
