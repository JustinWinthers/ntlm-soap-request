# `ntlm-soap-request`

Easily call a Windows authenticated soap service from Node

###### Inspired by the `TyBoss Framework`

---

[![NPM](https://nodei.co/npm/ntlm-soap-request.png?downloads=true&stars=true)](https://nodei.co/npm/ntlm-soap-request/)

## Installation (via [npm](https://npmjs.org/package/ntlm-soap-request))

```bash
$ npm install ntlm-soap-request
```

## Usage

### Calling it from your app using a node style callback:

````javascript
    var SoapRequest = require('ntlm-soap-request')

        , soap = new SoapRequest({
            userName:'YOUR_USERNAME',
            password:'YOUR_PASSWORD',
            domain:'YOUR_WINDOWS_DOMAIN',
            operationName: 'WCF_OPERATION_NAME',
            operationInputUrl:'WCF_OPERATION_INPUT_URL',
            endpoint:'WCF_SERVICE_URL'
        });

    soap.exec(function(err, result){

        if (err) console.log(err);

        if (result) console.log(JSON.stringify(result, undefined, '\t'));

    });
````

### Calling it from your app using the promise based api:

````javascript
    var SoapRequest = require('ntlm-soap-request')

        , soap = new SoapRequest({
            userName:'YOUR_USERNAME',
            password:'YOUR_PASSWORD',
            domain:'YOUR_WINDOWS_DOMAIN',
            operationName: 'WCF_OPERATION_NAME',
            operationInputUrl:'WCF_OPERATION_INPUT_URL',
            endpoint:'WCF_SERVICE_URL'
        });

var myPromise = soap.promise();

myPromise.then(function(result){

    console.log(JSON.stringify(result, undefined, '\t'));

});

myPromise.error(function(err){

    console.log ('error: ', err);

});
````

### Authorizing the request first, and storing the token for subsequent calls

Alternatively, you can authorize the request when you start your web server so that subsequent calls
will use the already authorized service call.  This way, you won't be logging in with each request.
Keepaliveagent is used to keep the socket open.  The following example shows how you can wire up a
route after you've authorized the service so your app won't keep reauthorizing the service, but instead
stay authorized with a cached token it received from the initial auth request.

````javascript
var   express      = require('express')
    , app          = express()
    , SoapRequest   = require('./ntlm-soap-request')

    , soap = new SoapRequest({
        userName:'YOUR_USERNAME',
        password:'YOUR_PASSWORD',
        domain:'YOUR_WINDOWS_DOMAIN',
        operationName: 'WCF_OPERATION_NAME',
        operationInputUrl:'WCF_OPERATION_INPUT_URL',
        endpoint:'WCF_SERVICE_URL'
    });

soap.authorize()

    .then(function(token){

        /* token is not used here, but shown to illustrate it exists
            but it's cached in the `soap` object
        */

        //set your route for your app
        app.get('/route/to/soap/abstraction',function(req, res) {
            soap.promise()
                .then(function(result){
                    res.status(200).json(result);
                })
                .error(function(err){
                    res.status(500).json({error:err});
                }
        });

    })
    .error(function(err){

      /* throw an error to either stop the server from starting if it's severe enough or handle the error
         gracefully
      */

      throw new Error('failed to authorize soap service');

    }

    ;
````


## Configuration Object Options

| Option | Description
| --- | ---
| `username` | set this to your windows user account or a windows service account on the windows machine where the service resides
| `password` | set to the windows account password for the account used above
| `domain` | set to the windows domain where the service resides
| `operationName` | set to the method/operation name in the wsdl you plan to call
| `operationInputUrl` | set to the full wsdl action input address for the operation.  Be sure to include the protocol `http:\\` or `https:\\` in the address
| `endpoint` | set to the full url address of the windows service you're calling.  Be sure to include the protocol `http:\\` or `https:\\` in the address


## Author

**[Follow me (@javascriptbully) on Twitter!](https://twitter.com/intent/user?screen_name=javascriptbully)**

[Justin Winthers](https://github.com/JustinWinthers) ([jwinthers@gmail.com](mailto:jwinthers@gmail.com))