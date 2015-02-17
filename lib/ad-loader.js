var createIframe = require('./create-iframe');
var utils = require('./utils');

var bind = utils.bind;
var onElement = utils.onElement;
var extend = utils.extend;

var AdLoader = function(config) {
    var self = this;
    this.config = extend({
        adtech: {},
        placements: []
    }, config);

};

extend(AdLoader.prototype, {
    getRequest: function() {
        var self = this,
            request;

        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
        } else {
            request = new global.ActiveXObject("MSXML2.XMLHTTP.3.0");
        }
        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                console.log('Hello, i am ads and here i am');
                self.onResponse.call(self, JSON.parse(request.responseText));
            }
        };

        return request;
    },
    isEmpty: function(src) {
        return (src.indexOf(this.config.emptySelector) === -1);
    },
    onResponse: function(ads) {
        var i, p, ad, src, iframe, container, placement;
        for(i in ads.ADTECH_MultiAd) {
            ad = ads.ADTECH_MultiAd[i];
            src = ad.Ad.AdCode;

            if (this.isEmpty(src)) {
                placement = null;
                for (p in this.config.placements) {
                    if (this.config.placements[p].id == parseInt(ad.PlacementId, 10)) {
                        placement = this.config.placements[p];
                        console.log(placement, this.config.placements[placement], parseInt(ad.PlacementId, 10));

                        break;
                    }
                }
                if (placement) {
                    if (!placement.selector) {
                        placement.selector = '#ad-'+ placement.name;
                    }

                    iframe = new createIframe(placement.id, ad.Ad.AdCode);

                    onElement(placement.selector, bind(iframe.renderTo, iframe), this.onElementNotFound);
                }
            }
            container = null;
        }
    },

    onElementNotFound: function() {
        console.log('No container found');
    },

    load: function(placements) {
        var ids = [], i, request;
        if (typeof(placements) !== 'undefined') {
            if (typeof(placements.id) !== 'undefined') {
                this.config.placements.push(placements);
                placements = [placements];
            } else if (typeof(placements.length) !== 'undefined') {
                this.config.placements = this.config.placements.concat(placements);
            }
        } else {
            placements = this.config.placements;
        }
        for (i in placements) {
            ids.push(placements[i].id);
        }

        console.log('Where are you ads?', ids);
        request = this.getRequest();
        request.open('GET', (this.config.proxy || '..') +'/proxy.php?placements='+ ids.join(','), true);
        request.send();
    }
});

module.exports = AdLoader;
