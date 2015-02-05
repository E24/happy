var on = (function(el, ev, callback) {
    if (el.addEventListener)
        return el.addEventListener(ev, callback, false);
    else 
        return el.attachEvent('on'+ ev, callback);
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

var createIframe = function(id, script) {
    var src = '', url;
    
    src += '<!doctype *><html><head><style>body { margin:0; )</style></head><body><div id="ad">';
    src += '<script>';
    src += script;
    src += '</script>';
    src += '</div></body></html>';

    console.log('creating iframe #'+ id);

    this.id = id;

    this.iframe = document.createElement('iframe');
    this.iframe.setAttribute('id', id);
    this.iframe.setAttribute('scrolling', 'no');
    this.iframe.setAttribute('frameborder', 0);
    if ('srcdoc' in this.iframe) {
        this.iframe.setAttribute('srcdoc', src);
    }
    // this.iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-top-navigation allow-forms allow-pointer-lock');
    
    document.getElementById(id).appendChild(this.iframe);

    if (!('srcdoc' in this.iframe)) {
        this.iframe.contentDocument.open();
        this.iframe.contentDocument.write(src);
        setTimeout(bind(function() { this.iframe.contentDocument.close(); }, this), 100);
        console.log('srcdoc missing, writing old school');
    }

    on(this.iframe, 'load', bind(this.onLoad, this));
    on(this.iframe, 'load', bind(this.resize, this));
};

createIframe.prototype.remove = function() {
    console.log('Removing: #'+ this.id);
    if (this.iframe.parentNode) {
        this.iframe.parentNode.removeChild(this.iframe);
    }
};

createIframe.prototype.onLoad = function() {
    var ifDoc = this.iframe.contentDocument;

    console.log('Loaded: #'+ this.id);

    if (ifDoc.querySelector('[src*="blank_pix_house.gif"]')) {
        this.remove();
    }
};

createIframe.prototype.resize = function() {
    var ifDoc = this.iframe.contentDocument;
    if (ifDoc) {
        var html = this.iframe.contentDocument.documentElement;
        var height = html.scrollHeight,
            width = html.scrollWidth;
        console.log('Resize: #'+ this.id +' width:'+ width +'px height:'+ height +'px');
        console.count('resize');
        if (height === 0 || width === 0) {
            this.remove();
        } else {
            this.iframe.setAttribute('width', width);
            this.iframe.setAttribute('height', height);
        }
    } else {
        this.remove();
    }
};

var adLoader = function(config) {
    var self = this;
    this.config = config;
    if (window.XMLHttpRequest) {
        this.request = new XMLHttpRequest();
    } else {
        this.request = new global.ActiveXObject("MSXML2.XMLHTTP.3.0");
    }
    this.request.onreadystatechange = function() {
        if (self.request.readyState === 4) {
            console.log('Hello, i am ads and here i am');
            self.onResponse.call(self, JSON.parse(self.request.responseText));
        }
    };
};

adLoader.prototype = {
    onResponse: function(ads) {
        var i, ad, src;
        for(i in ads.ADTECH_MultiAd) {
            ad = ads.ADTECH_MultiAd[i];
            src = ad.Ad.AdCode;
            if (src.indexOf(this.config.emptySelector)) {
                new createIframe(ad.PlacementId, ad.Ad.AdCode);
            }
        }
    },

    init: function(placements) {
        console.log('Where are you ads?');
        this.request.open('GET', '../proxy.php?placements='+ placements.join(','), true);
        this.request.send();
    }
};


var ads = new adLoader({
    emptySelector: 'blank_pix_house.gif'
});

ads.init([5254943,5254907,5254914,5254916,5254913,5254915,5254937,5254940,5254936,5254939,5254933,5254938,5254941,5254935,5278649]);
