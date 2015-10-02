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
