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
   * Retrieves all notes from the database.
   * @return {Array} notes - An array containing all notes.
   */
  readAll() {
    const array = [];
    Object.values(this.notes).forEach((n) => {
      array.push(n);
    });
    return array;
  }

  /**
   * Retrieves the note with the id.
   * @param {int} id - The id of the note to be retrieved.
   * @return {Note} The note with id passed or null if no note exists.
   */
  read(id) {
    let note = null;
    if (this.notes[id] !== undefined) {
      note = this.notes[id];
    }

    return note;
  }

  /**
   * Deletes the note with the id.
   * @param {int} id - The id of the note to be deleted.
   * @return {Note} The note with id passed or null if no note exists.
   */
  delete(id) {
    const notes = [];
    let note = null;

    Object.values(this.notes).forEach((value) => {
      if (id != value.id) {
        notes[value.id] = value;
      } else {
        note = value;
      }
    });
    this.notes = notes;

    return note;
  }

  /**
   * Updates a note having the id of the note passed according to the values of the latter.
   * @param {Note} note - Note containing the id and the new values.
   * @return {Note} The note with the updated values or null if the note doesn't exist.
   */
  update(note) {
    let newNote = null;

    Object.values(this.notes).forEach((value) => {
      if (note.id == value.id) {
        newNote = value;
        newNote.content = note.content;
        newNote.username = note.username;
      }
    });

    return newNote;
  }

  /**
   * Persists a note.
   * @param {Note} note - Note to be persisted.
   * @return {Note} note - The note persisted.
   */
  insert(note) {
    note.id = this.notes.length;
    this.notes[note.id] = note;
    return note;
  }
}

export default new NoteDAO();
