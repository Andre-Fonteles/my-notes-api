// import models from '../models/index.js';
import mocha from 'mocha';
import chai from 'chai';
import chaiThings from 'chai-things';
import models from '../models/index.js';

const User = models.User;

chai.should();
const expect = chai.expect;
chai.use(chaiThings);

const describe = mocha.describe;
const it = mocha.it;

describe('User Model Test Set', () => {
  it('Testing invalid usernames', (done) => {
    expect(User.isValidUsername(' username')).to.be.a('boolean').eql(false);
    expect(User.isValidUsername('-username')).to.be.a('boolean').eql(false);
    expect(User.isValidUsername('&username')).to.be.a('boolean').eql(false);
    expect(User.isValidUsername('+username')).to.be.a('boolean').eql(false);
    expect(User.isValidUsername('#username')).to.be.a('boolean').eql(false);
    expect(User.isValidUsername('1username')).to.be.a('boolean').eql(false);
    expect(User.isValidUsername('us')).to.be.a('boolean').eql(false);
    expect(User.isValidUsername(undefined)).to.be.a('boolean').eql(false);
    expect(User.isValidUsername(null)).to.be.a('boolean').eql(false);
    done();
  });

  it('Testing valid usernames', (done) => {
    expect(User.isValidUsername('a12')).to.be.a('boolean').eql(true);
    expect(User.isValidUsername('bob')).to.be.a('boolean').eql(true);
    expect(User.isValidUsername('username')).to.be.a('boolean').eql(true);
    done();
  });

  it('Testing invalid passwords', (done) => {
    expect(User.isValidPassword('     ')).to.be.a('boolean').eql(false);
    expect(User.isValidPassword('12345')).to.be.a('boolean').eql(false);
    expect(User.isValidPassword('')).to.be.a('boolean').eql(false);
    expect(User.isValidPassword('1')).to.be.a('boolean').eql(false);
    expect(User.isValidPassword(undefined)).to.be.a('boolean').eql(false);
    expect(User.isValidPassword(null)).to.be.a('boolean').eql(false);
    done();
  });

  it('Testing valid passwords', (done) => {
    expect(User.isValidPassword('123456')).to.be.a('boolean').eql(true);
    expect(User.isValidPassword('password')).to.be.a('boolean').eql(true);
    expect(User.isValidPassword('      ')).to.be.a('boolean').eql(true);
    expect(User.isValidPassword('¬!"£$%^&*()_+-=[]{}#~@/?.,<>\\|')).to.be.a('boolean').eql(true);
    done();
  });
});
