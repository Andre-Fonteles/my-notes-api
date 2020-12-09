/**
 * Represents a user.
 */
class User {
  static REG_EX_USERNAME = /^[a-zA-Z]+[\w-]{2,}$/;

  /**
   * Creates a note.
   * @constructor
   * @param {string} username - The username of the user.
   * @param {string} password - The password of the user.
   */
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  /**
   * Checks if a username is valid. Valid usernames start with a letter, followed
   * by at least 2 more letters or numbers.
   * @constructor
   * @param {string} username - The username.
   * @return {boolean} true if the username is valid and false otherwise
   */
  static isValidUsername(username) {
    if (username && this.REG_EX_USERNAME.test(username)) {
      return true;
    }
    return false;
  }

  /**
   * Checks if a password is valid. Valid passwords have at least
   * 6 characters.
   * @constructor
   * @param {string} password - The password.
   * @return {boolean} true if the password is valid and false otherwise
   */
  static isValidPassword(password) {
    if (password && password.length >= 6) {
      return true;
    }
    return false;
  }
}

export default User;
