import app from '../index.js';
import models from '../models/index.js';
import mocha from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiThings from 'chai-things';
import Note from '../models/Note.js';

chai.should();
chai.use(chaiHttp);
chai.use(chaiThings);

const describe = mocha.describe;
const it = mocha.it;

describe('Notes Route Test Set', () => {
  let user = null;
  let token = null;
  mocha.before((next) => {
    user = models.userDAO.insert(new models.User('tester', 'tester-pass'));
    token = models.tokenDAO.insert(models.Token.generateToken(user.username));
    next();
  });

  /*
  * Test HTTP requests on a dataset with no notes
  */
  describe('With an empty dataset:', () => {
    const cleanDataset = (done) => {
      const notes = models.noteDAO.readAll();
      Object.values(notes).forEach((note) => {
        models.noteDAO.delete(note.id);
      });
      done();
    };

    // Before each test, empty the data base
    mocha.beforeEach(cleanDataset);
    mocha.after(cleanDataset);

    it('/GET all notes', (done) => {
      chai.request(app)
          .get(`/users/${user.username}/notes/`)
          .set('Authorization', token.hash)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            done();
          });
    });

    it('/GET a note by id', (done) => {
      chai.request(app)
          .get(`/users/${user.username}/notes/1`)
          .set('Authorization', token.hash)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.empty;
            done();
          });
    });

    it('/DELETE a note by id', (done) => {
      chai.request(app)
          .delete(`/users/${user.username}/notes/1`)
          .set('Authorization', token.hash)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.empty;
            done();
          });
    });

    it('/PUT (update) a note', (done) => {
      const note = new models.Note(1, 'I should test more');

      chai.request(app)
          .put(`/users/${user.username}/notes/1`)
          .send(note)
          .set('Authorization', token.hash)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.empty;
            done();
          });
    });

    it('/POST (create) a note', (done) => {
      const note = new models.Note(1, user.username, 'I should test more');
      chai.request(app)
          .post(`/users/${user.username}/notes`)
          .set('Authorization', token.hash)
          .send(note)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.an('object');
            res.body.should.have.property('content').eql(note.content);
            res.body.should.have.property('username').eql(user.username);
            done();
          });
    });

    it('/POST (create) an invalid note', (done) => {
      const note = new models.Note(1, 'I should test more');
      chai.request(app)
          .post(`/users/${user.username}/notes`)
          .set('Authorization', token.hash)
          .send(note)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.not.have.property('content');
            res.body.should.not.have.property('username');
            done();
          });
    });
  });

  /*
  * Test HTTP requests on populated dataset
  */
  describe('With a populated dataset:', () => {
    // Before the test start, populate data base
    mocha.before((done) => {
      for (let i = 1; i <= 10; i++) {
        models.noteDAO.insert(new Note(i, 'This is my note #' + i));
      }
      done();
    });

    it('/GET all notes', (done) => {
      let note = new models.Note(1, user.username, 'I should test more');
      note = models.noteDAO.insert(note);

      chai.request(app)
          .get(`/users/${user.username}/notes`)
          .set('Authorization', token.hash)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.include.something.that.deep.equals(note);
            done();
          });
    });

    it('/GET a note by id', (done) => {
      let note = new models.Note(1, user.username, 'I should test more');
      note = models.noteDAO.insert(note);

      chai.request(app)
          .get(`/users/${user.username}/notes/${note.id}`)
          .set('Authorization', token.hash)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.an('object');
            res.body.should.have.property('content').eql(note.content);
            res.body.should.have.property('username').eql(user.username);
            res.body.should.have.property('id').eql(note.id);
            done();
          });
    });

    it('/DELETE a note by id', (done) => {
      let note = new models.Note(1, user.username, 'I should test more');
      note = models.noteDAO.insert(note);

      chai.request(app)
          .delete(`/users/${user.username}/notes/${note.id}`)
          .set('Authorization', token.hash)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.an('object');
            res.body.should.have.property('content').eql(note.content);
            res.body.should.have.property('username').eql(user.username);
            res.body.should.have.property('id').eql(note.id);
            done();
          });
    });

    it('/PUT (update) a note', (done) => {
      let note = new models.Note(-1, user.username, 'I should test more');
      note = models.noteDAO.insert(note);
      note.content = 'New content';

      chai.request(app)
          .put(`/users/${user.username}/notes/${note.id}`)
          .set('Authorization', token.hash)
          .send(note)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.an('object');
            res.body.should.have.property('content').eql(note.content);
            res.body.should.have.property('username').eql(user.username);
            res.body.should.have.property('id').eql(note.id);
            done();
          });
    });

    it('/POST (create) a note', (done) => {
      const note = new models.Note(1, user.username, 'I should test more');
      chai.request(app)
          .post(`/users/${user.username}/notes`)
          .set('Authorization', token.hash)
          .send(note)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.an('object');
            res.body.should.have.property('content').eql(note.content);
            res.body.should.have.property('username').eql(user.username);
            done();
          });
    });
  });

  mocha.after((done) => {
    app.server.close();
    done();
  });
});
