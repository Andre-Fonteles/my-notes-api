import crypto from 'crypto';

/**
 * Represents a token that authenticates/identifies a user.
 */
class Token {
  /**
   * Creates a note.
   * @constructor
   * @param {string} username - The username of the user.
   * @param {string} hash - The token of the user.
   * @param {string} creationDate - The datetime in which the token was created.
   */
  constructor(username, hash, creationDate) {
    this.username = username;
    this.hash = hash;
    this.creationDate = creationDate;
  }

  /**
   * Generates a brand new token to the user identified by username
   * @constructor
   * @param {string} username - The username of the user.
   * @return {Token} a brand new token for the user.
   */
  static generateToken(username) {
    const hash = crypto.randomBytes(64).toString('hex');
    const date = new Date();
    return new Token(username, hash, date);
  }
}

export default Token;
