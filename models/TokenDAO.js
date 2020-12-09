import Token from './Token.js';

/**
 * Represents an interface the handles persistency of a Note.
 */
class TokenDAO {
  /**
   * Creates a NoteDAO.
   * @constructor
   */
  constructor() {
    this.tokens = [];
    this.tokens[1] = new Token('admin', 'asd', Date.now());
    this.tokens[2] = new Token('admin', 'zxc', Date.now());
    this.tokens[3] = new Token('admin', 'qwe', Date.now());
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
    let auth = false;
    this.tokens.forEach( (token) => {
      if (token.username == username && token.hash == tokenHash) {
        auth = true;
      }
    });

    callback(auth);
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
    const tokens = [];
    let deleted = false;

    Object.values(this.tokens).forEach((token) => {
      if (token.username != username || token.hash != tokenHash) {
        tokens.push(token);
      } else {
        deleted = true;
      }
    });
    this.tokens = tokens;

    callback(deleted);
  }

  /**
   * Persists a token.
   * @param {Token} token - A new token to be registered.
   * @param {tokencallback} callback - callback function.
   */
  insert(token, callback) {
    this.tokens.push(token);
    callback(token);
  }
}

export default new TokenDAO();
