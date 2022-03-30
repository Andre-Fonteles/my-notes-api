import User from './User.js';
import bcrypt from 'bcrypt';
import pool from '../utils/pool.js';

/**
 * Represents an interface the handles persistency of a User.
 */
class UserDAO {
  static SALT_ROUNDS = 10;

  /**
   * Creates a UserDAO.
   * @constructor
   */
  constructor() {
  }

  /**
   * Callback for getting a note.
   *
   * @callback usercallback
   * @param {User} user - The user read/created/updated or null if nothing happened.
   */

  /**
   * Retrieves the user with the username.
   * @param {string} username - The username of the user to be retrieved.
   * @param {notecallback} callback - callback function.
   */
  read(username, callback) {
    pool.query('SELECT * FROM user WHERE username = ?', [username], (error, results, fields) => {
      if (error) {
        throw error;
      }
      if (results[0]) {
        callback(new User(results[0].username, results[0].password));
      } else {
        callback(null);
      }
    });
  }

  /**
   * Callback for operation.
   *
   * @callback booleancallback
   * @param {boolean} bool - True if the operation has been successful.
   */

  /**
   * Deletes the user with the username.
   * @param {string} username - The username of the user to be deleted.
   * @param {booleancallback} callback - callback function.
   */
  delete(username, callback) {
    const sql = 'DELETE FROM user WHERE username = ?';

    // Generate salt and hash password
    pool.query(sql, [username], (error, results, fields) => {
      if (error) {
        throw error;
      }
      callback(results.affectedRows > 0);
    });
  }

  /**
   * Updates a user having the username of the user passed according to the values of the latter.
   * @param {User} user - User containing the username and the new values.
   * @param {notecallback} callback - callback function.
   */
  update(user, callback) {
    const sql = 'UPDATE user SET password = ? WHERE username = ?';

    const updatedUser = new User(user.username, '');

    // Generate salt and hash password
    bcrypt.hash(user.password, UserDAO.SALT_ROUNDS, (err, hashPassword) => {
      if (err) {
        throw err;
      }
      pool.query(sql, [hashPassword, user.username], (error, results, fields) => {
        if (error) {
          throw error;
        }

        if (results.changedRows > 0) {
          callback(updatedUser);
        } else {
          callback(null);
        }
      });
    });
  }

  /**
   * Persists a user.
   * @param {User} user - User to be persisted.
   * @param {notecallback} callback - callback function.
   */
  insert(user, callback) {
    const sql = 'INSERT INTO user (username, password) VALUES (?, ?)';

    const newUser = new User(user.username, '');

    // Generate salt and hash password
    bcrypt.hash(user.password, UserDAO.SALT_ROUNDS, (err, hashPassword) => {
      if (err) {
        throw err;
      }
      pool.query(sql, [user.username, hashPassword], (error, results, fields) => {
        if (error) {
          throw error;
        }
        callback(newUser);
      });
    });
  }

  /**
   * Checks if the username and passwords match a user in the database.
   * @param {string} username - The username.
   * @param {string} plainPassword - The password.
   * @param {booleancallback} callback - callback function.
   */
  checkCredentials(username, plainPassword, callback) {
    this.read(username, (user) => {
      if (user) {
        bcrypt.compare(plainPassword, user.password, (err, result) => {
          callback(result);
        });
      }
    });
  }
}

export default new UserDAO();
