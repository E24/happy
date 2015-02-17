var utils = require('./utils');
var on = utils.on,
    off = utils.off,
    bind = utils.bind,
    attr = utils.attr,
    extend = utils.extend,
    nextTick = utils.nextTick;

var lazyIframe;

var createIframe = function(id, script) {
    var src = '', url;

    this.id = id;

    src += '<!doctype *><html><head><style>body { margin:0; )</style></head><body><div id="ad">';
    src += '<script>';
    src += script;
    src += '</script>';
    src += '</div></body></html>';

    if (!lazyIframe) {
        this.iframe = lazyIframe = document.createElement('iframe');
    } else {
        this.iframe = lazyIframe.cloneNode();
    }

    this.renderIframeContents(id, src);
    on(this.iframe, 'load', bind(this.onLoad, this));
    on(this.iframe, 'load', bind(this.resize, this));
};

extend(createIframe.prototype, {
    iframe: null,
    contentDocument: null,
    supportSrcDoc: function() {
        var support = 'srcdoc' in this.iframe;

        this.supportSrcDoc = function() {
            return support;
        };

        return this.supportSrcDoc();
    },

    renderIframeContents: function(id, src) {
        attr(this.iframe, {
            id: id,
            scrolling: 'no',
            frameborder: 0
        });

        if (this.supportSrcDoc()) {
            this.iframe.setAttribute('srcdoc', src);
            attr(this.iframe, {
                srcdoc: src
            });
        }
        else {
            var ifDoc = this.getContentDocument();
            ifDoc.open();
            ifDoc.write(src);
            setTimeout(function() { ifDoc.close(); }, 100);
            console.log('srcdoc missing, writing old school');
        }

    },

    renderTo: function(container) {
        nextTick(bind(function() {
            while(container.lastChild) {
                container.removeChild(container.lastChild);
            }
            container.appendChild(this.iframe);
        }, this));
    },

    getContentDocument: function() {
        if (!this.contentDocument) {
            this.contentDocument = this.iframe.contentDocument;
        }
        return this.contentDocument;
    },

    container: function() {
        return this.iframe;
    },

    remove: function() {
        console.log('Removing: #'+ this.id);
        if (this.iframe.parentNode) {
            off(this.iframe, 'load', this.onLoad);
            off(this.iframe, 'load', this.resize);
            this.iframe.parentNode.removeChild(this.iframe);
        }
    },

    onLoad: function() {
        var ifDoc = this.getContentDocument();

        console.log('Loaded: #'+ this.id);

        if (ifDoc.querySelector('[src*="blank_pix_house.gif"]')) {
            this.remove();
        }
    },

    resize: function() {
        var ifDoc = this.getContentDocument();
        if (ifDoc) {
            var html = ifDoc.documentElement,
                height = html.scrollHeight,
                width = html.scrollWidth;
            console.log('Resize: #'+ this.id +' width:'+ width +'px height:'+ height +'px');
            console.count('resize');
            if (height === 0 || width === 0) {
                this.remove();
            } else {
                attr(this.iframe, {
                    width: width,
                    height: height
                });
            }
        } else {
            this.remove();
        }
    }
});

module.exports = createIframe;
