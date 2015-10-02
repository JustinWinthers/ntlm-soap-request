(function (){
    /*global describe, it provided by mocha*/

    'use strict';

    var expect = require('chai').expect
        , SoapRequest = require('../')
        , nock = require('nock')
        , soap = new SoapRequest({
            userName:'justin',
            password:'mypassword',
            domain:'github',
            operationName: 'bangonit',
            operationInputUrl:'http://address.of.the.operation',
            endpoint:'http://my.successful.soap.call.svc'
        });


    describe('PROMISES:', function () {

        createNockInstances(2);

        it('promise method should return a promise when a callback is not specified', function (done) {
            expect(soap.promise()).to.have.property('then');
            done();
        });

        createNockInstances(1);

        it('authorize method should return a promise when a callback is not specified', function (done) {
            expect(soap.authorize()).to.have.property('then');
            done();
        });
    });


    function createNockInstances(iterator){

        for (var i=0; i<iterator; i++){
            // setup fake soap url instance for type 1 and type 3 posts
            nock('http://my.successful.soap.call.svc')
                .intercept('/','POST')
                .reply(200, 'Mocked Soap Service',
                { 'content-type': 'text/html; charset=us-ascii',
                    'www-authenticate': 'NTLM somecrazylongauthenticationbearerstring'
                }
            );
        }

    }

})();