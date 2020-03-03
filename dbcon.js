var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_paula',
  password        : '5033',
  database        : 'cs340_paula'
});
module.exports.pool = pool;
