var request = require('ntlm-soap-request')

    , request = new request({
        userName:'YOUR_USERNAME',
        password:'YOUR_PASSWORD',
        domain:'YOUR_WINDOWS_DOMAIN',
        serviceMethod: 'WCF_METHOD_NAME',
        serviceNameSpace:'WCF_NAMESPACE_URL',
        endpoint:'WCF_SERVICE_URL'
    });

var myPromise = request.promise();

myPromise.then(function(result){

    console.log(JSON.stringify(result, undefined, '\t'));

});

myPromise.error(function(err){

    console.log ('error: ', err);

});
