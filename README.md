#Inspired by the TyBoss Framework

#Description

Easily call a Windows authenticated soap service, from Node


#How can I install it?

1) Get the library:

**Using npm**

        npm install ntlm-soap-request


#Calling it from your app:

````javascript

    var request = require('ntlm-soap-request')

        , request = new request({
            userName:'YOUR_USERNAME',
            password:'YOUR_PASSWORD',
            domain:'YOUR_WINDOWS_DOMAIN',
            serviceMethod: 'WCF_METHOD_NAME',
            serviceNameSpace:'WCF_NAMESPACE_URL',
            endpoint:'WCF_SERVICE_URL'
        });

    request.exec(function(err, result){

        if (result) console.log(JSON.stringify(result, undefined, '\t'));

    });

````