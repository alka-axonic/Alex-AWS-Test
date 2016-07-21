
var express = require('express');
var shelljs = require('shelljs');
var os = require('os');
var app = express();

var AWSController = require('deployment/setEnviromentVariables.js');

app.get('/', function (req, res) {
    //res.send(JSON.parse(shelljs.exec('aws ec2 describe-instances --filters Name=tag:NODE_ENV,Values=production')));
    AWSController.setENviromentVariables(function(err, deployment){
        if ( err ) return res.send(err);
        if ( deployment ) {
            res.send(process.env);
        }

    });
});

app.listen(3000, function () {
console.log(os.hostname().replace('ip-',''));
  console.log('Example app listening on port 3000!');
});
