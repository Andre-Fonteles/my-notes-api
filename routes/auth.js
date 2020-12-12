import models from '../models/index.js';
import express from 'express';

const routerFunction = express.Router;
const router = routerFunction({mergeParams: true});

router.all('/*', (req, res, next) => {
  const tokenHash = req.headers['authorization'];
  const username = req.params.username;

  models.tokenDAO.checkToken(username, tokenHash, (good) => {
    if (good) {
      next();
    } else {
      res.status(401).send('Unauthorized');
    }
  });
});

export default router;
