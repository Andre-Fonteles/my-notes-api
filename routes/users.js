import models from '../models/index.js';
import express from 'express';

const router = express();

router.get('/:username', (req, res) => {
  models.userDAO.read(req.params.username, (user) => {
    if (user) {
      delete user.password;
    }
    res.send(user);
  });
});

router.post('/', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Validate input
  if (models.User.isValidUsername(username) && models.User.isValidPassword(password)) {
    models.userDAO.insert(new models.User(username, password), (user) => {
      delete user.password;
      res.send(user);
    });
  } else {
    res.status(400).send('Invalid Username or password');
  }
});

router.put('/:username', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const newPassword = req.body.newPassword;

  // Check old password
  models.userDAO.checkCredentials(username, password, (success) => {
    if (success) {
      if (models.User.isValidUsername(username) && models.User.isValidPassword(newPassword)) {
        // Generate salt and hash password
        models.userDAO.update(new models.User(username, newPassword), (user) => {
          delete user.password;
          res.send(user);
        });
      } else {
        res.status(400).send('Invalid Input');
      }
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

router.delete('/:username', (req, res) => {
  const username = req.params.username;
  const password = req.body.password;

  // Check password
  models.userDAO.checkCredentials(username, password, (success) => {
    if (success) {
      models.userDAO.delete(username, (success) => {
        res.send(success);
      });
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

export default router;
