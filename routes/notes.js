import models from '../models/index.js';
import express from 'express';

const routerFunction = express.Router;
const router = routerFunction({mergeParams: true});

router.get('/', (req, res) => {
  res.send(models.noteDAO.readAll());
});

router.get('/:noteId', (req, res) => {
  res.send(models.noteDAO.read(req.params.noteId));
});

router.post('/', (req, res) => {
  const id = -1;
  const content = req.body.content;
  const username = req.params.username;

  if (models.Note.isValidContent(content) && models.User.isValidUsername(username)) {
    const note = models.noteDAO.insert(new models.Note(id, username, content));
    res.send(note);
  } else {
    res.status(400).send('Invalid Note');
  }
});

router.put('/:noteId', (req, res) => {
  const id = req.params.noteId;
  const content = req.body.content;
  const username = req.params.username;
  let note = new models.Note(id, username, content);
  note = models.noteDAO.update(note);
  res.send(note);
});

router.delete('/:noteId', (req, res) => {
  const id = req.params.noteId;
  const note = models.noteDAO.delete(id);
  res.send(note);
});

export default router;
