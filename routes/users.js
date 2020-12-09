import models from '../models/index.js';
import express from 'express';

const router = express();

router.get('/:usersame', (req, res) => {
  const user = models.userDAO.read(req.params.userId);
  delete user.password;
  res.send(models.userDAO.read(req.params.userId));
});

router.post('/', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (models.User.isValidUsername(username) && models.User.isValidPassword(password)) {
    const user = models.userDAO.insert(new models.User(username, password));
    res.send(user);
  } else {
    res.status(400).send('Invalid User');
  }
});

router.put('/:username', (req, res) => {
  const username = req.params.username;
  const password = req.body.password;
  let user = new models.User(username, password);
  user = models.userDAO.update(user);

  res.send(user);
});

router.delete('/:username', (req, res) => {
  const username = req.params.username;
  const user = models.userDAO.delete(username);
  res.send(user);
});

export default router;
