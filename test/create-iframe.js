var CreateIframe = require('../lib/create-iframe');

var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

var spies = require('chai-spies');
chai.use(spies);

// Set srcdoc setters and getters
HTMLIFrameElement.prototype.__defineGetter__('srcdoc', function() { return this.srcdoc; });
HTMLIFrameElement.prototype.__defineSetter__('srcdoc', function(val) { this.srcdoc = val; });

describe('Create Iframe', function() {
    var iframe = new CreateIframe(1337, 'document.write("Yolo")');

    it('should have an id', function() {
        expect(iframe.id).to.eql(1337);
    });

    it('should have a container', function() {
        assert.isFunction(iframe.container);
        assert.instanceOf(iframe.container(), HTMLIFrameElement);
    });

    it('should have a srcdoc', function() {
        expect(iframe.container().getAttribute('srcdoc')).to.contain('Yolo');
    });

    it('should be able to remove', function() {
        assert.isFunction(iframe.remove);
    });

    it('should be able to resize', function() {
        assert.isFunction(iframe.resize);
    }); 

    it('should remove if container height is 0', function() {
        var spy = chai.spy(iframe.remove);

        iframe.container().contentDocument = {
            documentElement: {
                scrollHeight: 0
            }
        }; 
        iframe.remove = spy;

        iframe.resize(); 

        expect(spy).to.have.been.called.once;
    });
});
