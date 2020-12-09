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
   * Checks whether the username & token combination are valid or not.
   * @param {string} username - The username of the user who holds the token.
   * @param {string} tokenHash - The token hash.
   * @return {boolean} true if the user has this token, false otherwise.
   */
  checkToken(username, tokenHash) {
    let auth = false;
    this.tokens.forEach( (token) => {
      if (token.username == username && token.hash == tokenHash) {
        auth = true;
      }
    });

    return auth;
  }

  /**
   * Deletes the token from a user.
   * @param {string} username - The username of the user who holds the token.
   * @param {string} tokenHash - The token hash.
   * @return {boolean} true if the token has been successfuly deleted, false otherwise.
   */
  delete(username, tokenHash) {
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

    return deleted;
  }

  /**
   * Persists a token.
   * @param {Token} token - A new token to be registered.
   * @return {Token} the token, if successfully created.
   */
  insert(token) {
    this.tokens.push(token);
    return token;
  }
}

export default new TokenDAO();
