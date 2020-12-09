import models from '../models/index.js';
import express from 'express';

const routerFunction = express.Router;
const router = routerFunction({mergeParams: true});

router.get('/', (req, res) => {
  const username = req.params.username;

  models.noteDAO.readAll(username, (notes) => {
    res.send(notes);
  });
});

router.get('/:noteId', (req, res) => {
  const username = req.params.username;

  models.noteDAO.read(req.params.noteId, username, (note) => {
    res.send(note);
  });
});

router.post('/', (req, res) => {
  const id = -1;
  const content = req.body.content;
  const username = req.params.username;

  if (models.Note.isValidContent(content) && models.User.isValidUsername(username)) {
    const newNote = new models.Note(id, username, content);

    models.noteDAO.insert(newNote, (note) => {
      res.send(note);
    });
  } else {
    res.status(400).send('Invalid Note');
  }
});

router.put('/:noteId', (req, res) => {
  // TODO : validate
  const id = req.params.noteId;
  const content = req.body.content;
  const username = req.params.username;
  const updatedNote = new models.Note(id, username, content);

  models.noteDAO.update(updatedNote, username, (note) => {
    res.send(note);
  });
});

router.delete('/:noteId', (req, res) => {
  const id = req.params.noteId;
  const username = req.params.username;

  models.noteDAO.delete(id, username, (note) => {
    res.send(note);
  });
});

export default router;
