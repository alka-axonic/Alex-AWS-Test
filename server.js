var express = require('express');
var shelljs = require('shelljs');
var app = express();

app.get('/', function (req, res) {
    res.send(JSON.parse(shelljs.exec('aws ec2 describe-tags')));
  res.send('Hello World! from AWS!!! UHUHUU');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});