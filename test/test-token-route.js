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

describe('Token/Login Route Test Set', () => {
  let user = null;
  mocha.beforeEach((next) => {
    user = new models.User('john', 'pass');
    models.userDAO.insert(user, (newUser) => {
      next();
    });
  });

  mocha.afterEach((next) => {
    models.userDAO.delete(user.username, (deletedUser) => {
      next();
    });
  });

  it('/POST a user (login)', (done) => {
    chai.request(app)
        .post('/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('username');
          res.body.should.have.property('hash');
          res.body.should.have.property('creationDate');
          done();
        });
  });

  it('/POST a user (login) with invalid credentials', (done) => {
    user.password += ' ';
    chai.request(app)
        .post('/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
  });

  it('/DELETE token (logout)', (done) => {
    models.tokenDAO.insert(models.Token.generateToken(user.username), (token) => {
      chai.request(app)
          .delete('/login')
          .send(user)
          .set('Authorization', token.hash)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('boolean').eql(true);
            done();
          });
    });
  });

  it('/DELETE non-exiting token', (done) => {
    chai.request(app)
        .delete('/login')
        .send(user)
        .set('Authorization', 'this-is-a-non-existent-token')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('boolean').eql(false);
          done();
        });
  });

  mocha.after((done) => {
    app.server.close();
    done();
  });
});
