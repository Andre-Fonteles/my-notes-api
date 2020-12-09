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
   * Retrieves all users from the database.
   * @return {Array} users - An array containing all users.
   */
  readAll() {
    return this.users;
  }

  /**
   * Retrieves the user with the username.
   * @param {string} username - The username of the user to be retrieved.
   * @return {User} The user with id passed or null if no note exists.
   */
  read(username) {
    let user = undefined;
    if (this.users[username] !== undefined) {
      user = this.users[username];
    }

    return user;
  }

  /**
   * Deletes the user with the username.
   * @param {string} username - The username of the user to be deleted.
   * @return {User} The user with username passed or null if no user exists.
   */
  delete(username) {
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

    return user;
  }

  /**
   * Updates a user having the username of the user passed according to the values of the latter.
   * @param {User} user - User containing the username and the new values.
   * @return {User} The user with the updated values or null if the user doesn't exist.
   */
  update(user) {
    let newUser = null;

    Object.values(this.users).forEach((value) => {
      if (user.username == value.username) {
        newUser = value;
        newUser.password = user.password;
      }
    });

    return newUser;
  }

  /**
   * Persists a user.
   * @param {User} user - User to be persisted.
   * @return {User} The user persisted.
   */
  insert(user) {
    this.users[user.id] = user;
    return new User(user.username, user.password);
  }

  /**
   * Checks if the username and passwords match a user in the database.
   * @param {string} username - The username.
   * @param {string} password - The password.
   * @return {boolean} true if the username and password match a user.
   */
  checkCredentials(username, password) {
    let valid = false;
    Object.values(this.users).forEach((user) => {
      if (user.username == username && user.password == password) {
        valid = true;
      }
    });

    return valid;
  }
}

export default new UserDAO();
