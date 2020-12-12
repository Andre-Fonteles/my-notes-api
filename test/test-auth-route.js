import app from '../index.js';
import models from '../models/index.js';
import mocha from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiThings from 'chai-things';

chai.should();
chai.use(chaiHttp);
chai.use(chaiThings);

const describe = mocha.describe;
const it = mocha.it;

describe('Auth Route Test Set', () => {
  let user = null;
  mocha.beforeEach((next) => {
    models.userDAO.insert(new models.User('Auth Tester' + Date.now(), 'tester-pass'), (newUser) => {
      user = newUser;
      next();
    });
  });

  mocha.afterEach((next) => {
    models.userDAO.delete(user.username, (deletedUser) => {
      next();
    });
  });

  it('/GET some resource from a user with no token', (done) => {
    chai.request(app)
        .get(`/users/${user.username}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.not.have.property('username');
          res.body.should.not.have.property('password');
          done();
        });
  });

  it('/GET some resource from a user with a wrong token', (done) => {
    chai.request(app)
        .get(`/users/${user.username}`)
        .set('Authorization', 'wrong-token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.not.have.property('username');
          res.body.should.not.have.property('password');
          done();
        });
  });
});
