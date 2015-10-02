(function (){
    /*global describe, it provided by mocha*/

    'use strict';

    var assert = require('chai').assert
        , SoapRequest = require('../')
        , nock = require('nock')
        , config = {
            userName:'justin',
            password:'mypassword',
            domain:'github',
            operationName: 'bangonit',
            operationInputUrl:'http://address.of.the.operation',
            endpoint:'http://my.successful.soap.call.svc'
        }
        , soap;

    createNockInstances(200, 1);  // initial authorize
    createNockInstances(401, 2);  // failed get from wcf service
    createNockInstances(200, 3);  // successful reauthorize attempt
    createNockInstances(200, 4);  // successful get from wcf service

    describe('RESPONSES:', function () {

        it('trying again after 401 on success should equal Mocked soap service call 4', function (done) {

            soap = new SoapRequest(config);
            soap.isAuthorized = true;



            var promise = soap.authorize();

            promise.then(function(token){

                var val;

                soap.promise()

                    .then ( function(value){  val = value; })
                    .finally( function (){
                        try {
                            assert.equal(val, 'Mocked soap service call 4');
                            done();
                        }
                        catch (err) {
                            done(err)
                        }
                    })
            });
        });

    });


    function createNockInstances(replyStatus, num){

        var type2 = 'NTLM TlRMTVNTUAACAAAACgAKADgAAAAFgomi8A9DXIy46TUAAAAAAAAAAKoAqgBCAAAABgGxHQAAAA9OAFIARQBDAEEAAgAKAE4AUgBFAEMAQQABABwAVgBBAFYAUwAtAE4ARQBCAC0AVwBFAEIAMAAxAAQAGAB2AGEALgBuAHIAZQBjAGEALgBvAHIAZwADADYAVgBBAFYAUwAtAE4ARQBCAC0AVwBFAEIAMAAxAC4AdgBhAC4AbgByAGUAYwBhAC4AbwByAGcABQASAG4AcgBlAGMAYQAuAG8AcgBnAAcACAB16fArIf3QAQAAAAA='

        // setup fake soap url instance for type 1 and type 3 posts
        nock('http://my.successful.soap.call.svc')
            .intercept('/','POST')
            .reply(replyStatus, '<Envelope><Body>Mocked soap service call ' + num + '</Body></Envelope>',
            { 'content-type': 'text/html; charset=us-ascii',
                server: 'Microsoft-HTTPAPI/2.0',
                'www-authenticate': type2,
                date: 'Fri, 02 Oct 2015 14:46:50 GMT',
                'content-length': '341'
            }
        );
    }

})();