var async       = require('async');
var fs          = require('fs');
var shelljs     = require('shelljs');

async.auto({
    getRDSinstanceData : function(callback, results){
        shelljs.exec('aws rds describe-db-instances --db-instance-identifier ' + process.env.NODE_ENV + ' > /home/ec2-user/rds.json', function(code, stdout, stderr){
            if ( stderr ) return callback(stderr);

            return callback(null, true);
        });
    },
    readRDSDatafromFile : ['getRDSinstanceData', function(callback, results) {
        if ( results.getRDSinstanceData ){
            fs.readFile('/home/ec2-user/rds.jsonX', 'utf8', function (err, data) {
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
});

