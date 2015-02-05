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
            var i, ad, src, iframe, container, placement;
            for(i in ads.ADTECH_MultiAd) {
                ad = ads.ADTECH_MultiAd[i];
                src = ad.Ad.AdCode;

                if (src.indexOf(this.config.emptySelector) === -1) {
                    for (placement in this.config.placements) {
                        if (this.config.placements[placement] == parseInt(ad.PlacementId, 10)) {
                            console.log(placement, this.config.placements[placement], parseInt(ad.PlacementId, 10));
                            container = document.getElementById('ad-'+ placement);
                        }
                    }
                    if (container) {
                        iframe = new createIframe(ad.PlacementId, ad.Ad.AdCode);
                        iframe.renderTo(container);
                    } else {
                        console.log('No container found');
                    }
                }
                container = null;
            }
        },
 
        init: function() {
            var placements = [], i;
            for (i in this.config.placements) {
                placements.push(this.config.placements[i]);
            }
            console.log('Where are you ads?');
            this.request.open('GET', (this.config.proxy || '..') +'/proxy.php?placements='+ placements.join(','), true);
            this.request.send();
        }
    };

    return adLoader;
});

