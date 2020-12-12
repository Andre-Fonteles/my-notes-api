import express from 'express';
import routes from './routes/index.js';
import configDb from './utils/initdb.js';

const app = express();

configDb().then(() => { // Make sure the DB is set up before anything else
  const port = 3000;
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(express.json());

  // app.use('/users/:username', routes.auth);
  app.use('/users', routes.auth);

  app.use('/login', routes.login);
  app.use('/users/:username/notes', routes.notes);
  app.use('/users', routes.users);

  app.server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
  return;
});

export default app;
