const config = require('../config/db');

let connection = null;
let isReady = false;

const mysql = require('mysql');
connection = mysql.createConnection(config.db);

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected to MySQL!");
  isReady = true;
});

function query(sql, params) {
  if (!isReady) {
    reject(Error('Data base is not ready'));
  }
  return new Promise( ( resolve, reject ) => {
    connection.query( sql, params, ( err, rows ) => {
      if ( err )
        return reject( err );
      resolve( rows );
    } );
  } );
}

function escape(text) {
  return connection.escape(text);
}

module.exports = {
  query,
  escape,
};