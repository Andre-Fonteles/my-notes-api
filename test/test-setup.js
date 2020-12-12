import app from '../index.js';
import mocha from 'mocha';
import pool from '../utils/pool.js';

mocha.before((done) => {
  app.setupPromisse.then(done);
});

mocha.after((done) => {
  app.server.close();
  pool.end();
  done();
});
