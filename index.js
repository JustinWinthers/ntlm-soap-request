var ntlm = require('httpntlm').ntlm;
var async = require('async');
var httpreq = require('httpreq');
var HttpAgent = require('agentkeepalive');
var keepaliveAgent = new HttpAgent({keepAlive: true});
var xml2js = require('xml2js');
var Promise = require("bluebird");

var NtlmSoapRequest = function(config){

    this.config = config

};

NtlmSoapRequest.prototype = {

    buildOptions: function(config){

        return {
            url: config.endpoint,
            username: config.userName,
            password: config.password,
            workstation: '',
            domain: config.domain
        };
    },

    buildSoapRequest: function(config){
        return [
            "<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:tem=\"http://tempuri.org/\">",
            "<soap:Header xmlns:wsa=\"http://www.w3.org/2005/08/addressing\">",
            "<wsa:Action>" + config.serviceNameSpace + "</wsa:Action>",
            "<wsa:To>" + config.endpoint + "</wsa:To>",
            "</soap:Header>",
            "<soap:Body>",
            "<tem:" + config.serviceMethod + "/>",
            "</soap:Body>",
            "</soap:Envelope>"
        ].join('\n');
    },


    buildType1Message: function(options){

        return ntlm.createType1Message(options)
    },


    postType1ToServer: function(request, callback){

        return httpreq.post(request.options.url, {
            body:request.soapRequest,
            headers:{
                'Content-Type': 'application/soap+xml;charset=UTF-8;action=' + request.config.serviceNameSpace,
                'Connection' : 'keep-alive',
                'Authorization': request.type1Message
            },
            agent: keepaliveAgent
        }, callback);
    },

    buildType2Message:function(res){

        return ntlm.parseType2Message(res.headers['www-authenticate']);

    },

    buildType3Message: function(type2Message, options){

        return ntlm.createType3Message(type2Message, options)

    },

    postType3ToServer: function(request, callback){

        httpreq.post(request.options.url, {
            body:request.soapRequest,
            headers:{
                'Content-Type': 'application/soap+xml;charset=UTF-8',
                'Connection' : 'Close',
                'Authorization': request.type3Message
            },
            allowRedirects: false,
            agent: keepaliveAgent
        }, callback);
    },

    parseResponse: function(res, callback){

        var parseOptions = {
            trim: true,
            normalizeTags:false,
            ignoreAttrs: true,
            explicitArray: false
        };

        if (res.statusCode === 200) {

            var data = res.body.replace(/s:/g,'').replace(/b:/g,'');

            var parseString = xml2js.parseString;

            parseString(data, parseOptions, function (err, result) {

                callback(null, result.Envelope.Body);

            });


        } else {

            var data = res.body.replace(/s:/g,'').replace(/a:/g,'');

            var parseString = xml2js.parseString;

            parseString(data, parseOptions, function (err, result) {

                callback(result.Envelope.Body.Fault.Reason.Text);

            });

        }

    },

    processRequest: function(context, callback){

        async.waterfall([

                function (callback){

                    context.postType1ToServer(context, callback);

                },


                function (responseFromServer, callback) {

                    context.type2message = context.buildType2Message(responseFromServer);

                    if (!responseFromServer.headers['www-authenticate'])
                        callback(new Error('www-authenticate not found on response of second request'));
                    else
                        callback (null, context.type2message);

                },


                function (type2message, callback) {

                    context.type3message = context.buildType3Message(type2message, context.options)

                    callback(null, context.type3message);


                },


                function (type3msg, callback) {

                    context.postType3ToServer(context, callback);


                },

                function (responseFromServerType3, callback){

                    context.parseResponse(responseFromServerType3, callback)

                }

            ],

            function (err, data) {

                if (err) callback (err);

                if (data) callback (null, data);

            });
    },

    promise: function(){return this.exec()},

    exec: function(callback){

        this.options = this.buildOptions(this.config);
        this.soapRequest = this.buildSoapRequest(this.config);
        this.type1Message = this.buildType1Message(this.options);

        if (callback){
            this.processRequest(this, callback);
        } else {

            var self = this;
            return new Promise(function (resolve, reject) {

                self.processRequest(self, function (err, res) {

                    if (err) reject(err);

                    else resolve(res);

                });

            })
        }

    }
};

module.exports =  NtlmSoapRequest;