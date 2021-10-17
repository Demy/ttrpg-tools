const config = require('../config/db');

const mysql = require('mysql');

var pool  = mysql.createPool({
    connectionLimit : 60,
    multipleStatements: true,
    ...config.db
});


function query(sql) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function(err, connection) {
      connection.query(sql, function(err, rows) {
        connection.release();
          if (err)
            return reject(err);
          resolve(rows);
      });
    });
  });
}

function escape(text) {
  return mysql.escape(text);
}

module.exports = {
  query,
  escape,
};