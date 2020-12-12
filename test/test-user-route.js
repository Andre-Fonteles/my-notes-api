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
    models.userDAO.insert(new models.User('User-Tester' + Date.now(), 'tester-pass'), (newUser) => {
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
    chai.request(app)
        .delete(`/users/${user.username}`)
        .set('Authorization', token.hash)
        .end((err, res) => {
          res.should.have.status(200);
          console.log(JSON.stringify(res.body));
          res.should.be.an('object');
          res.body.should.be.an('boolean').eql(true);
          done();
        });
  });

  it('/PUT (update) a user', (done) => {
    const userToUpdate = new models.User(user.username, 'New password');

    chai.request(app)
        .put(`/users/${user.username}`)
        .set('Authorization', token.hash)
        .send(userToUpdate)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.an('object');
          res.body.should.not.have.property('password');
          res.body.should.have.property('username').eql(user.username);
          models.userDAO.checkCredentials(userToUpdate.username, userToUpdate.password, (result) => {
            chai.expect(result).to.eql(true);
            done();
          });
        });
  });

  describe('Creating user', () => {
    let userToPost = null;

    mocha.beforeEach((next) => {
      userToPost = new models.User('User-Tester-Post', 'tester-pass');
      next();
    });

    mocha.after((done) => {
      models.userDAO.delete(userToPost.username, (deletedUser) => {
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

    it('/POST an invalid user', (done) => {
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
  });
});
