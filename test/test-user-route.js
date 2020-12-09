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

describe('User Route Test Set', () => {
  let user = null;
  let token = null;
  mocha.beforeEach((next) => {
    models.userDAO.insert(new models.User('tester', 'tester-pass'), (newUser) => {
      user = newUser;
      models.tokenDAO.insert(models.Token.generateToken(user.username), (newToken) => {
        token = newToken;
        next();
      });
    });
  });

  mocha.after((next) => {
    models.userDAO.delete(user, (deletedUser) => {
      next();
    });
  });

  it('/GET a user by username', (done) => {
    chai.request(app)
        .get(`/users/${user.username}`)
        .set('Authorization', token.hash)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.an('object');
          res.body.should.not.have.property('password');
          res.body.should.have.property('username').eql(user.username);
          done();
        });
  });

  it('/DELETE a user by username', (done) => {
    chai.request(app)
        .delete(`/users/${user.username}`)
        .set('Authorization', token.hash)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.an('object');
          res.body.should.have.property('password').eql(user.password);
          res.body.should.have.property('username').eql(user.username);
          done();
        });
  });

  it('/PUT (update) a user', (done) => {
    user.password = 'New password';

    chai.request(app)
        .put(`/users/${user.username}`)
        .set('Authorization', token.hash)
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.an('object');
          res.body.should.have.property('password').eql(user.password);
          res.body.should.have.property('username').eql(user.username);
          done();
        });
  });

  it('/POST (create) a user', (done) => {
    chai.request(app)
        .post('/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.an('object');
          res.body.should.have.property('password').eql(user.password);
          done();
        });
  });

  it('/POST (create) an invalid user', (done) => {
    delete user.password;
    chai.request(app)
        .post('/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.not.have.property('username');
          res.body.should.not.have.property('password');
          done();
        });
  });

  mocha.after((done) => {
    app.server.close();
    done();
  });
});
