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