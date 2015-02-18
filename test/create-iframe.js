var CreateIframe = require('../lib/create-iframe');

var chai = require('chai');
var expect = chai.expect;

// Set srcdoc setters and getters
HTMLIFrameElement.prototype.__defineGetter__('srcdoc', function() { return this.srcdoc; });
HTMLIFrameElement.prototype.__defineSetter__('srcdoc', function(val) { this.srcdoc = val; });

describe('Create Iframe', function() {
    var container = new CreateIframe(1337, 'document.write("Yolo")');

    it('should have an id', function() {
        expect(container.id).to.eql(1337);
    });

    it('should have a srcdoc', function() {
        expect(container.iframe.getAttribute('srcdoc')).to.contain('Yolo');
    }); 
});
