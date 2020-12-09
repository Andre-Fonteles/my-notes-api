import express from 'express';

import routes from './routes/index.js';

const app = express();
const port = 3000;

// console.log('process.env.NODE_ENV : ' + (process.env.NODE_ENV || 'development'));
// console.log('app.settings.NODE_ENV : ' + app.settings.NODE_ENV);

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

export default app;
