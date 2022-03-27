import mocha from 'mocha';
import chai from 'chai';
import chaiThings from 'chai-things';
import models from '../models/index.js';

const Note = models.Note;

chai.should();
const expect = chai.expect;
chai.use(chaiThings);

const describe = mocha.describe;
const it = mocha.it;

describe('Note Model Test Set', () => {
  it('Testing invalid content', (done) => {
    expect(Note.isValidContent('')).to.be.a('boolean').eql(false);
    expect(Note.isValidContent('   ')).to.be.a('boolean').eql(false);
    expect(Note.isValidContent(' ')).to.be.a('boolean').eql(false);
    expect(Note.isValidContent(undefined)).to.be.a('boolean').eql(false);
    expect(Note.isValidContent(null)).to.be.a('boolean').eql(false);
    done();
  });

  it('Testing valid content', (done) => {
    expect(Note.isValidContent('1')).to.be.a('boolean').eql(true);
    expect(Note.isValidContent('normal content')).to.be.a('boolean').eql(true);
    expect(Note.isValidContent('¬!"£$%^&*()_+-=[]{}#~@/?.,<>\\|')).to.be.a('boolean').eql(true);
    done();
  });
});
