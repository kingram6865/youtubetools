const mysql = require('mysql2')
require('dotenv').config()

const DBCONFIG = {
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
}

const pool = (db) => mysql.createPool({...DBCONFIG, database: db, waitForConnections: true})
const formatSQL = (SQL, parameters) => mysql.format(SQL, parameters)

async function executeSQL(conn, sql) {
  let results
  try {
    results = await conn.promise().query(sql);
  } catch(err) {
    console.log(err)
  }

  return results;
}

module.exports = {
  pool,
  formatSQL,
  executeSQL
}
