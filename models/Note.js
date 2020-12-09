/**
 * Represents a note.
 */
class Note {
  /**
   * Creates a note.
   * @constructor
   * @param {int} id - The id of the note.
   * @param {string} username - The username of the author.
   * @param {string} content - The content of the note.
   */
  constructor(id, username, content) {
    this.id = id;
    this.username = username;
    this.content = content;
  }

  /**
   * Checks if a content is valid. A valid content must not
   * be a non-empty string.
   * @constructor
   * @param {string} content - The content.
   * @return {boolean} true if the content is valid and false otherwise
   */
  static isValidContent(content) {
    if (content) {
      content = content.trim();
      if (content.length > 0) {
        return true;
      }
    }
    return false;
  }
}

export default Note;
