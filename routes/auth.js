import models from '../models/index.js';
import express from 'express';

const router = express();

router.all('/:username', (req, res, next) => {
  const tokenHash = req.headers['authorization'];
  const username = req.params.username;

  if (models.tokenDAO.checkToken(username, tokenHash)) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
});

export default router;
