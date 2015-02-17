var utils = require('./utils');
var on = utils.on,
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
    supportSrcDoc: function () {
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
            this.iframe.contentDocument.open();
            this.iframe.contentDocument.write(src);
            setTimeout(bind(function() { this.iframe.contentDocument.close(); }, this), 100);
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

    container: function() {
        return this.iframe;
    },

    remove: function() {
        console.log('Removing: #'+ this.id);
        if (this.iframe.parentNode) {
            this.iframe.parentNode.removeChild(this.iframe);
        }
    },

    onLoad: function() {
        var ifDoc = this.iframe.contentDocument;

        console.log('Loaded: #'+ this.id);

        if (ifDoc.querySelector('[src*="blank_pix_house.gif"]')) {
            this.remove();
        }
    },

    resize: function() {
        var ifDoc = this.iframe.contentDocument;
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
