import models from '../models/index.js';
import express from 'express';

const router = express();

router.post('/', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  models.userDAO.checkCredentials(username, password, (success) => {
    if (success) {
      models.tokenDAO.insert(models.Token.generateToken(username), (token) => {
        if (token) {
          res.send(token);
        } else {
          res.status(500).send('Internal server error');
        }
      });
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

router.delete('/', (req, res) => {
  const token = req.headers['authorization'];
  const username = req.body.username;
  models.tokenDAO.delete(username, token, (success) => {
    res.send(success);
  });
});

export default router;
