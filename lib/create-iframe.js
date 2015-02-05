var on = require('./utils').on,
    bind = require('./utils').bind;

var createIframe = function(id, script) {
    var src = '', url;

    src += '<!doctype *><html><head><style>body { margin:0; )</style></head><body><div id="ad">';
    src += '<script>';
    src += script;
    src += '</script>';
    src += '</div></body></html>';

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

module.exports = createIframe;
