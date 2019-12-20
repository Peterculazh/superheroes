const casper = require('casperjs');

describe('Testing pages', function() {
    before(function(){
        casper.start(process.env.TEST_URL)
    });

    it('should return HTTP 200', function() {
        expect(casper.currentHTTPStatus).to.equal(200);
    });
});
