import config from '../config.js';
import mysql from 'mysql';

const CHECK_SQL = `SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.SCHEMATA
                    WHERE SCHEMA_NAME = '${config.database.database}'`;

const CREATE_SQL = `CREATE DATABASE ${config.database.database};
                    USE ${config.database.database};
                    CREATE TABLE user(
                      username VARCHAR(40),
                      password VARCHAR(60),
                      PRIMARY KEY(username)
                    );
                    `;

/**
 * Creates the database if it does not exist.
 */
const configDb = async () => {
  const db = config.database.database;
  delete config.database.database;
  config.database.multipleStatements = true;

  const con = mysql.createConnection(config.database);

  config.database.multipleStatements = false;
  config.database.database = db;

  con.connect();

  con.query(CHECK_SQL, (err, results) => {
    if (err) {
      throw err;
    }

    // If the database does not exist, then create it
    if (results[0].count == 0) {
      con.query(CREATE_SQL, (err, result) => {
        if (err) {
          throw err;
        }
      });
    }
    con.end();
  });
};

export default configDb;
