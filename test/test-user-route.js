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
  const password = 'tester-pass';

  mocha.beforeEach((next) => {
    models.userDAO.insert(new models.User('User-Tester' + Date.now(), password), (newUser) => {
      user = newUser;
      models.tokenDAO.insert(models.Token.generateToken(user.username), (newToken) => {
        token = newToken;
        next();
      });
    });
  });

  mocha.afterEach((next) => {
    models.userDAO.delete(user.username, (deletedUser) => {
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
    user.password = password;
    chai.request(app)
        .delete(`/users/${user.username}`)
        .set('Authorization', token.hash)
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.an('object');
          res.body.should.be.an('boolean').eql(true);
          done();
        });
  });

  it('/PUT (update) a user', (done) => {
    user.password = password;
    user.newPassword = 'New password';

    chai.request(app)
        .put(`/users/${user.username}`)
        .set('Authorization', token.hash)
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.an('object');
          res.body.should.not.have.property('password');
          res.body.should.have.property('username').eql(user.username);
          models.userDAO.checkCredentials(user.username, user.newPassword, (result) => {
            chai.expect(result).to.eql(true);
            done();
          });
        });
  });

  describe('Creating user', () => {
    let registeredUser = null;
    let userToPost = null;

    mocha.before((next) => {
      models.userDAO.insert(new models.User('User-Tester' + Date.now(), password), (newUser) => {
        registeredUser = newUser;
        next();
      });
    });

    mocha.beforeEach((next) => {
      userToPost = new models.User('User-Tester-Post', password);
      next();
    });

    mocha.after((done) => {
      models.userDAO.delete(userToPost.username, (deletedUser) => {
        done();
      });
    });

    mocha.after((done) => {
      models.userDAO.delete(registeredUser.username, (deletedUser) => {
        done();
      });
    });

    it('/POST a valid user', (done) => {
      chai.request(app)
          .post('/users')
          .send(userToPost)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.an('object');
            res.body.should.not.have.property('password');
            done();
          });
    });

    it('/POST a user with no password', (done) => {
      delete userToPost.password;
      chai.request(app)
          .post('/users')
          .send(userToPost)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.not.have.property('username');
            res.body.should.not.have.property('password');
            done();
          });
    });

    it('/POST a user with already existing username', (done) => {
      chai.request(app)
          .post('/users')
          .send(registeredUser)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.not.have.property('username');
            res.body.should.not.have.property('password');
            done();
          });
    });
  });
});
