var shelljs         = require('shelljs');

var dbInstance = shelljs.exec('aws rds describe-db-instances --db-instance-identifier zenkit');

console.log(dbInstance);