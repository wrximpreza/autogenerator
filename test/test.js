var superagent = require('superagent');
var should = require('should');

describe('homepage', function(){
    it('should respond to GET',function(done){
        superagent('GET', 'http://localhost:3000/')
            .end(function(res){
                console.log(res);
                should(res.status).equal(200);
                done()
            })
    })
});
