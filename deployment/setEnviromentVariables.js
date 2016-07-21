var async       = require('async');
var fs          = require('fs');
var os          = require('os');
var shelljs     = require('shelljs');
var validateip  = require('validate-ip');

/*async.auto({
    getRDSinstanceData : function(callback, results){
        // --db-instance-identifier muss gleich DB Instance sein.
        shelljs.exec('aws rds describe-db-instances --db-instance-identifier ' + process.env.NODE_ENV + ' > /home/ec2-user/rds.json', function(code, stdout, stderr){
            if ( stderr ) return callback(stderr);

            return callback(null, true);
        });
    },
    readRDSDatafromFile : ['getRDSinstanceData', function(callback, results) {
        if ( results.getRDSinstanceData ){
            fs.readFile('/home/ec2-user/rds.json', 'utf8', function (err, data) {
                if ( err ) return callback(err);
                var obj = JSON.parse(data);
                return callback(null, obj);
            });
        }else{
            return callback(true, null);
        }
    }],
    setRDSenv : ['readRDSDatafromFile', function(callback, results){
        var rdsJson = results.readRDSDatafromFile;
        //return callback(null, obj.DBInstances[0].Endpoint);
    }]
}, function(err, results){
    if ( err ) return console.log(err);
    console.log(results);
});*/

var Controller = {
    setENviromentVariables: function(next){
        async.auto({
            extractInstancePrivateIp    : function(callback, result) {
                var privateIp = os.hostname().replace('ip-', '').replace(/-/g,'.');
                if ( !validateip(privateIp) ) return callback('Invalid IP');
                callback(null, privateIp);
            },
            awsCommand                  : ['extractInstancePrivateIp', function(callback, results){
                var privateIp = results.extractInstancePrivateIp;
                var cmd = 'aws ec2 describe-instances --filters Name=private-ip-address,Values='+privateIp+' > /home/ec2-user/instance-data.json';
                shelljs.exec(cmd, function(code, stderr, stdout){
                    if ( stderr ) return callback(stderr);
                    return callback(null, true);
                });
            }],
            extractTags             : ['awsCommand', function(callback, results){
                fs.readFile('/home/ec2-user/instance-data.json', 'utf8', function (err, data) {
                    if ( err ) return callback(err);
                    var obj = JSON.parse(data);
                    return callback(null, obj.Reservations[0].Instances[0].Tags);
                });
            }],
            setEnviromentVariables  : ['extractTags', function(callback, results){
                var tags = results.extractTags;
                async.each(
                    tags,
                    function(tag, callback){
                        process.env[tag.Key] = tag.Value;
                        callback(null,process.env[tag.Key]);
                    },
                    callback
                );
            }]
        }, function(error, results) {
            if ( error ) return next(err);
            return next(null, true);
        });
    }
};

module.exports = Controller;

