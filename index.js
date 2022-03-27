import express from 'express';
import routes from './routes/index.js';
import configDb from './utils/initdb.js';
import Promise from 'promise';

const app = express();

// Make sure the DB is set up before anything else
app.setupPromisse = configDb().then(new Promise((resolve, reject) => {
  const port = 3000;
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(express.json());

  app.use('/', routes.accessControl);

  app.use('/login', routes.login);

  app.use('/users/:username', routes.auth);

  app.use('/users', routes.users);
  app.use('/users/:username/notes', routes.notes);

  app.server = app.listen(port, () => {
    console.log(`My Notes API listening at http://localhost:${port}`);
    resolve();
  });
}));

export default app;
