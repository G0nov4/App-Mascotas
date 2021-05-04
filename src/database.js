const mysql = require('mysql');
const { database } = require('./keys');
const { promisify } = require('util');


// Start connection DataBase
const pool = mysql.createPool(database);

// Get status of Databas
pool.getConnection((err, connection) => {
    err ?
        err.code = 'PROTOCOL_CONNECTION_LOST'?
            console.error("DATABASE CONNESCTION WAS CLOSED :(")
        : err.code = 'ER_CON_COUNT_ERROR'?
            console.error("DATABASE HAS TO MANY CONNECTION :()")
        :err.code = 'ECONNREFUSED'?
            console.error('DATABASE CONNECTION WAS REFUSED :(')
        : console.log('[!]...  Database Error..!!!')
    : console.log('[*] Not error... :)')

    if(connection){
        connection.release();
        console.log('[!] DB IS CONNECT :)');
        return;
    }
});


// convert query in promise
pool.query = promisify(pool.query);


// export database
module.exports = pool;