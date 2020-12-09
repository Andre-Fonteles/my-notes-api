import models from '../models/index.js';
import express from 'express';

const router = express();

router.post('/', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (models.userDAO.checkCredentials(username, password)) {
    const token = models.tokenDAO.insert(models.Token.generateToken(username));
    if (token) {
      res.send(token);
    } else {
      res.status(500).send('Internal server error');
    }
  } else {
    res.status(401).send('Invalid credentials');
  }
});

router.delete('/', (req, res) => {
  const token = req.headers['authorization'];
  const username = req.body.username;
  const response = models.tokenDAO.delete(username, token);
  res.send(response);
});

export default router;
