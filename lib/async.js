var AdLoader = require('./ad-loader');
(function(window) {
    var ads = {},
        adLoader;

    window.ads = window.ads || {placements: []};
    if (window.ads.adtech) {
        if (window.ads.placements.length) {
            adLoader = new AdLoader({adtech: window.ads.adtech, placements: window.ads.placements});
            adLoader.load();
        }
    }
    window.ads.placements = {
        push: function(placement) {
            if (!adLoader) {
                adLoader = new AdLoader({adtech: window.ads.adtech});
            }
            adLoader.load(placement);
        }
    };
})(window);
