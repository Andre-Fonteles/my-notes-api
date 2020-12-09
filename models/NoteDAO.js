import Note from './Note.js';

/**
 * Represents an interface the handles persistency of a Note.
 */
class NoteDAO {
  /**
   * Creates a NoteDAO.
   * @constructor
   */
  constructor() {
    this.notes = [];
    this.notes[1] = new Note(1, 'Hello, this is a note', 'admin');
    this.notes[2] = new Note(2, 'Remember to learn NodeJS/Express', 'admin');
    this.notes[3] = new Note(3, 'Remember to learn React', 'admin');
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
    const array = [];
    Object.values(this.notes).forEach((n) => {
      if (n.username === username) {
        array.push(n);
      }
    });
    callback(array);
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
    let note = null;
    if (this.notes[id] !== undefined && this.notes[id].username === username) {
      note = this.notes[id];
    }

    callback(note);
  }

  /**
   * Deletes the note with the id.
   * @param {int} id - The id of the note to be deleted.
   * @param {string} username - The username of the author.
   * @param {notecallback} callback - callback function.
   */
  delete(id, username, callback) {
    const notes = [];
    let note = null;

    Object.values(this.notes).forEach((value) => {
      if (id != value.id || value.username != username) {
        notes[value.id] = value;
      } else {
        note = value;
      }
    });
    this.notes = notes;

    callback(note);
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
    const notes = [];
    let response = false;

    Object.values(this.notes).forEach((value) => {
      if (username != value.username) {
        notes[value.id] = value;
      } else {
        response = true;
      }
    });
    this.notes = notes;

    callback(response);
  }

  /**
   * Updates a note having the id of the note passed according to the values of the latter.
   * @param {Note} note - Note containing the id and the new values.
   * @param {string} username - The username of the author.
   * @param {notecallback} callback - callback function.
   */
  update(note, username, callback) {
    let newNote = null;

    Object.values(this.notes).forEach((value) => {
      if (note.id == value.id && username === value.username) {
        newNote = value;
        newNote.content = note.content;
        newNote.username = note.username;
      }
    });

    callback(newNote);
  }

  /**
   * Persists a note.
   * @param {Note} note - Note to be persisted.
   * @param {notecallback} callback - callback function.
   */
  insert(note, callback) {
    note.id = this.notes.length;
    this.notes[note.id] = note;
    callback(note);
  }
}

export default new NoteDAO();
