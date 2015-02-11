;(function (name, definition) {
    var root = this;
    if (typeof define === 'function' && define.amd) {
        define(name, function() {
            return (root[name] = definition());
        });
    } else {
        window[name] = definition();
    }
})('happy', function() {
    var createIframe = require('./create-iframe');
    var bind = require('./utils').bind;
    var onElement = require('./utils').onElement;

    var AdLoader = function(config) {
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

    AdLoader.prototype = {
        onResponse: function(ads) {
            var i, p, ad, src, iframe, container, placement;
            for(i in ads.ADTECH_MultiAd) {
                ad = ads.ADTECH_MultiAd[i];
                src = ad.Ad.AdCode;

                if (src.indexOf(this.config.emptySelector) === -1) {
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
                        onElement(placement.selector, bind(iframe.renderTo, iframe), function() {
                            console.log('No container found');
                        });
                    }
                }
                container = null;
            }
        },

        load: function(placements) {
            var ids = [], i;
            for (i in this.config.placements) {
                if(typeof(placements) === 'undefined' || (placements.length && placements.indexOf(this.config.placements[i].name) !== -1)) {
                    ids.push(this.config.placements[i].id);
                }
            }
            console.log('Where are you ads?', ids);
            this.request.open('GET', (this.config.proxy || '..') +'/proxy.php?placements='+ ids.join(','), true);
            this.request.send();
        }
    };

    return AdLoader;
});

