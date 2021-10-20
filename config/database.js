const mysql = require("mysql");
const util = require("util");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "hola1234",
  database: "db_employees",
});

pool.query = util.promisify(pool.query);
module.exports = pool;
