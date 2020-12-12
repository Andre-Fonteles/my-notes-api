import Note from './Note.js';
import pool from '../utils/pool.js';

/**
 * Represents an interface the handles persistency of a Note.
 */
class NoteDAO {
  /**
   * Creates a NoteDAO.
   * @constructor
   */
  constructor() {
  }

  /**
   * Callback for getting a list of notes.
   *
   * @callback listcallback
   * @param {Array} notes - An array containing all notes.
   */

  /**
   * Retrieves all notes from an author.
   * @param {string} username - The username of the author.
   * @param {listcallback} callback - callback function
   */
  readAll(username, callback) {
    const notes = [];

    pool.query('SELECT * FROM note WHERE username = ?', [username], (error, results, fields) => {
      if (error) {
        throw error;
      }
      for (let i = 0; results[i]; i++) {
        notes.push(new Note(parseInt(results[i].id), results[i].username, results[i].content));
      }
      callback(notes);
    });
  }

  /**
   * Callback for getting a note.
   *
   * @callback notecallback
   * @param {Note} note - The note read/created/updated or null if nothing happened.
   */

  /**
   * Retrieves the note with the id.
   * @param {int} id - The id of the note to be retrieved.
   * @param {string} username - The username of the author.
   * @param {notecallback} callback - callback function.
   */
  read(id, username, callback) {
    pool.query('SELECT * FROM note WHERE id = ? AND username = ?', [id, username], (error, results, fields) => {
      if (error) {
        throw error;
      }
      if (results[0]) {
        callback(new Note(parseInt(results[0].id), results[0].username, results[0].content));
      } else {
        callback(null);
      }
    });
  }

  /**
   * Deletes the note with the id.
   * @param {int} id - The id of the note to be deleted.
   * @param {string} username - The username of the author.
   * @param {booleancallback} callback - callback function.
   */
  delete(id, username, callback) {
    const sql = 'DELETE FROM note WHERE id = ? AND username = ?';

    // Generate salt and hash password
    pool.query(sql, [id, username], (error, results, fields) => {
      if (error) {
        throw error;
      }
      callback(results.affectedRows > 0);
    });
  }


  /**
   * Callback for operation.
   *
   * @callback booleancallback
   * @param {boolean} bool - True if the operation has been successful.
   */

  /**
   * Deletes all notes from a user.
   * @param {string} username - The username of the author.
   * @param {booleancallback} callback - callback function.
   */
  deleteAll(username, callback) {
    const sql = 'DELETE FROM note WHERE username = ?';

    // Generate salt and hash password
    pool.query(sql, [username], (error, results, fields) => {
      if (error) {
        throw error;
      }
      callback(results.affectedRows > 0);
    });
  }

  /**
   * Updates a note having the id of the note passed according to the values of the latter.
   * @param {Note} note - Note containing the id and the new values.
   * @param {string} username - The username of the author.
   * @param {notecallback} callback - callback function.
   */
  update(note, username, callback) {
    const sql = 'UPDATE note SET content = ? WHERE id = ? AND username = ?';

    // Generate salt and hash password
    pool.query(sql, [note.content, note.id, note.username], (error, results, fields) => {
      if (error) {
        throw error;
      }

      if (results.changedRows > 0) {
        callback(note);
      } else {
        callback(null);
      }
    });
  }

  /**
   * Persists a note.
   * @param {Note} note - Note to be persisted.
   * @param {notecallback} callback - callback function.
   */
  insert(note, callback) {
    const sql = 'INSERT INTO note (username, content) VALUES (?, ?)';
    const sqlLastInsert = 'SELECT LAST_INSERT_ID() as noteId';

    pool.getConnection((error, connection) => {
      if (error) {
        throw error;
      }

      connection.query(sql, [note.username, note.content], (error, results, fields) => {
        if (error) {
          throw error;
        }
        connection.query(sqlLastInsert, (error, results, fields) => {
          if (error) {
            throw error;
          }
          note.id = parseInt(results[0].noteId);
          callback(note);
          connection.release();
        });
      });
    });
  }
}

export default new NoteDAO();
