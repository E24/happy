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
