var request = require('ntlm-soap-request')

    , request = new request({
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