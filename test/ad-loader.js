var AdLoader = require('../lib/ad-loader');

var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

var sinon = require('sinon');

var spies = require('chai-spies');
chai.use(spies);

var dummyResponse = {
    ADTECH_MultiAd: [
        {
            PlacementId: 1234,
            AdId: "11326954",
            Alias: "",
            Ad: {
                AdCode: "document.write('PURFORMANCE');",
            }
        }
    ]
};

describe('Ad Loader', function() {
    var loader, requests, server;
    
    beforeEach(function() {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function (req) { requests.push(req); };
    });
    afterEach(function() {
//        xhr.restore();
    });

    it('should be able to laod placements from config with one request', function() {
        loader = new AdLoader({
            placements: [
                {
                    id: 1,
                    name: 'placement#1'
                },
                {
                    id: 2,
                    name: 'placement#2'
                },
                {
                    id: 3,
                    name: 'placement#3'
                }
            ]
        });
        sinon.stub(loader, 'getRequest');

        loader.load();

        sinon.assert.calledOnce(loader.getRequest);
    });

    it('should be able to load individual placements with one request for each placement', function() {
        loader = new AdLoader();
        sinon.stub(loader, 'getRequest');

        loader.load({
            id: 1337,
            name :'leet'
        });
        loader.load({
            id: 86400,
            name: 'day'
        });
        
        sinon.assert.calledTwice(loader.getRequest);
    });

    it('should be able to load placements provided in array', function() {
        loader = new AdLoader();
        sinon.stub(loader, 'getRequest');

        loader.load([
            {
                id: 1337,
                name :'leet'
            },
            {
                id: 86400,
                name: 'day'
            },
            {
                id: 123,
                name: 'one-two-three'
            }
        ]);

        sinon.assert.calledOnce(loader.getRequest);
    });

    it('should be able to render iframe', function() {
        server = sinon.fakeServer.create();
        server.respondWith(JSON.stringify(dummyResponse));

        var placement = document.createElement('div');
        placement.setAttribute('id', 'ad-super');
        document.body.appendChild(placement);

        loader = new AdLoader();

        loader.load({
            id: 1234,
            name: 'super'
        });
        server.respond();

        server.restore();
    });
});
