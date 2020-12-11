import models from '../models/index.js';
import express from 'express';

const router = express();

router.get('/:usersame', (req, res) => {
  models.userDAO.read(req.params.userId, (user) => {
    delete user.password;
    res.send(user);
  });
});

router.post('/', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Validate input
  if (models.User.isValidUsername(username) && models.User.isValidPassword(password)) {
    models.userDAO.insert(new models.User(username, password), (user) => {
      res.send(user);
    });
  } else {
    res.status(400).send('Invalid User');
  }
});

router.put('/:username', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // TODO: Check password again

  if (models.User.isValidUsername(username) && models.User.isValidPassword(password)) {
    // Generate salt and hash password
    models.userDAO.update(new models.User(username, password), (user) => {
      res.send(user);
    });
  } else {
    res.status(400).send('Invalid Input');
  }
});

router.delete('/:username', (req, res) => {
  const username = req.params.username;
  models.userDAO.delete(username, (user) => {
    res.send(user);
  });
});

export default router;
