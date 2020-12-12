import pool from '../utils/pool.js';

/**
 * Represents an interface the handles persistency of a Note.
 */
class TokenDAO {
  /**
   * Creates a NoteDAO.
   * @constructor
   */
  constructor() {
  }

  /**
   * Callback for operation.
   *
   * @callback booleancallback
   * @param {boolean} bool - True if the operation has been successful.
   */

  /**
   * Checks whether the username & token combination are valid or not.
   * @param {string} username - The username of the user who holds the token.
   * @param {string} tokenHash - The token hash.
   * @param {booleancallback} callback - callback function.
   */
  checkToken(username, tokenHash, callback) {
    const sql = 'SELECT * FROM token WHERE username = ? AND hash = ?';
    pool.query(sql, [username, tokenHash], (error, results, fields) => {
      if (error) {
        throw error;
      }

      callback(results.length > 0);
    });
  }

  /**
   * Callback for getting a note.
   *
   * @callback tokencallback
   * @param {Token} token - The token read/created or null if nothing happened.
   */

  /**
   * Deletes the token from a user.
   * @param {string} username - The username of the user who holds the token.
   * @param {string} tokenHash - The token hash.
   * @param {booleancallback} callback - callback function.
   */
  delete(username, tokenHash, callback) {
    const sql = 'DELETE FROM token WHERE username = ? AND hash = ?';

    // Generate salt and hash password
    pool.query(sql, [username, tokenHash], (error, results, fields) => {
      if (error) {
        throw error;
      }
      callback(results.affectedRows > 0);
    });
  }

  /**
   * Persists a token.
   * @param {Token} token - A new token to be registered.
   * @param {tokencallback} callback - callback function.
   */
  insert(token, callback) {
    const sql = 'INSERT INTO token (username, hash, creation_date) VALUES (?, ?, ?)';

    pool.query(sql, [token.username, token.hash, token.creationDate], (error, results, fields) => {
      if (error) {
        throw error;
      }
      callback(token);
    });
  }
}

export default new TokenDAO();
