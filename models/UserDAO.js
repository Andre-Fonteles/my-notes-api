import User from './User.js';

/**
 * Represents an interface the handles persistency of a User.
 */
class UserDAO {
  /**
   * Creates a UserDAO.
   * @constructor
   */
  constructor() {
    this.users = {};
    this.users[1] = new User('admin', 'admin');
    this.users[2] = new User('admin2', 'admin3');
    this.users[3] = new User('admin3', 'admin3');
  }

  /**
   * Callback for getting a note.
   *
   * @callback usercallback
   * @param {User} user - The user read/created/updated or inserted or null if nothing happened.
   */

  /**
   * Retrieves the user with the username.
   * @param {string} username - The username of the user to be retrieved.
   * @param {notecallback} callback - callback function.
   */
  read(username, callback) {
    let user = undefined;
    if (this.users[username] !== undefined) {
      user = this.users[username];
    }

    callback(user);
  }

  /**
   * Deletes the user with the username.
   * @param {string} username - The username of the user to be deleted.
   * @param {notecallback} callback - callback function.
   */
  delete(username, callback) {
    const users = [];
    let user = null;

    Object.values(this.users).forEach((value) => {
      if (username != value.username) {
        users[value.username] = value;
      } else {
        user = value;
      }
    });
    this.users = users;

    callback(user);
  }

  /**
   * Updates a user having the username of the user passed according to the values of the latter.
   * @param {User} user - User containing the username and the new values.
   * @param {notecallback} callback - callback function.
   */
  update(user, callback) {
    let newUser = null;

    Object.values(this.users).forEach((value) => {
      if (user.username == value.username) {
        newUser = value;
        newUser.password = user.password;
      }
    });

    callback(newUser);
  }

  /**
   * Persists a user.
   * @param {User} user - User to be persisted.
   * @param {notecallback} callback - callback function.
   */
  insert(user, callback) {
    this.users[user.id] = user;
    callback(new User(user.username, user.password));
  }


  /**
   * Callback for operation.
   *
   * @callback booleancallback
   * @param {boolean} bool - True if the operation has been successful.
   */

  /**
   * Checks if the username and passwords match a user in the database.
   * @param {string} username - The username.
   * @param {string} password - The password.
   * @param {booleancallback} callback - callback function.
   */
  checkCredentials(username, password, callback) {
    let valid = false;
    Object.values(this.users).forEach((user) => {
      if (user.username == username && user.password == password) {
        valid = true;
      }
    });

    callback(valid);
  }
}

export default new UserDAO();
