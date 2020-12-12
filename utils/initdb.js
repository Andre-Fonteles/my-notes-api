import config from '../config.js';
import mysql from 'mysql';
import Promise from 'promise';

const CHECK_SQL = `SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.SCHEMATA
                    WHERE SCHEMA_NAME = '${config.database.database}'`;

const CREATE_SQL = `DROP DATABASE IF EXISTS ${config.database.database};
                    CREATE DATABASE ${config.database.database};
                    USE ${config.database.database};
                    CREATE TABLE user(
                      username VARCHAR(40) NOT NULL,
                      password VARCHAR(60) NOT NULL,
                      PRIMARY KEY (username)
                    );
                    CREATE TABLE note(
                      id MEDIUMINT NOT NULL AUTO_INCREMENT,
                      username VARCHAR(40) NOT NULL,
                      content VARCHAR(300) NOT NULL,
                      PRIMARY KEY (id),
                      FOREIGN KEY (username) REFERENCES user(username) ON DELETE CASCADE
                    );
                    CREATE TABLE token(
                      username VARCHAR(40) NOT NULL,
                      hash VARCHAR(128) NOT NULL,
                      creation_date DATETIME NOT NULL,
                      PRIMARY KEY (hash),
                      FOREIGN KEY (username) REFERENCES user(username) ON DELETE CASCADE
                    );
                    `;

/**
 * Creates the database if it does not exist.
 * @return {Promise}
 */
function configDb() {
  return new Promise((resolve, reject) => {
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
      if (results[0].count == 0 || (process.env.NODE_ENV && process.env.NODE_ENV == 'test')) {
        con.query(CREATE_SQL, (err, result) => {
          if (err) {
            throw err;
          }
          resolve();
        });
      } else {
        resolve();
      }
      con.end();
    });
  });
}

export default configDb;
