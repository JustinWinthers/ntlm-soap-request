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

        , request = new SoapRequest({
            userName:'YOUR_USERNAME',
            password:'YOUR_PASSWORD',
            domain:'YOUR_WINDOWS_DOMAIN',
            operationName: 'WCF_OPERATION_NAME',
            operationInputUrl:'WCF_OPERATION_INPUT_URL',
            endpoint:'WCF_SERVICE_URL'
        });

    request.exec(function(err, result){

        if (result) console.log(JSON.stringify(result, undefined, '\t'));

    });
````

### Calling it from your app using the promise based api:

````javascript
    var SoapRequest = require('ntlm-soap-request')

        , request = new SoapRequest({
            userName:'YOUR_USERNAME',
            password:'YOUR_PASSWORD',
            domain:'YOUR_WINDOWS_DOMAIN',
            operationName: 'WCF_OPERATION_NAME',
            operationInputUrl:'WCF_OPERATION_INPUT_URL',
            endpoint:'WCF_SERVICE_URL'
        });

var myPromise = request.promise();

myPromise.then(function(result){

    console.log(JSON.stringify(result, undefined, '\t'));

});

myPromise.error(function(err){

    console.log ('error: ', err);

});
````

## Configuration Object Options

| Option | Description
| --- | ---
| `username` | set this to your windows user account or a windows service account on the windows machine where the service resides
| `password` | set to the windows account password for the account used above
| `domain` | set to the windows domain where the service resides
| `operationName` | set to the method/operation name in the wsdl you plan to call
| `operationInputUrl` | set to the full wsdl action input address for the operation; be sure to include the protocol `http:\\` or `https:\\` in the address
| `endpoint` | set to the full url address of the windows service you're calling; be sure to include the protocol `http:\\` or `https:\\` in the address


## Author

**[Follow me (@javascriptbully) on Twitter!](https://twitter.com/intent/user?screen_name=javascriptbully)**

[Justin Winthers](https://github.com/JustinWinthers) ([jwinthers@gmail.com](mailto:jwinthers@gmail.com))