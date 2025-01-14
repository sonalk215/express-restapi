const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth controller - Login', () => {
  it('should throw an error with code 500 if accessing the database fails', (done) => {
    sinon.stub(User, 'findOne');
    User.findOne.throws();

    const req = {
      body: {
        email: 'test@test.com',
        password: 'tester',
      }
    }
    AuthController.login(req, {}, () => {})
    .then(result => {
      // console.log(result);
      expect(result).to.be.an('error');
      expect(result).to.have.property('statusCode', 500);
      done();
    })
  })

  it('should send a response with a valid user status for an existing user', function (done) {
    mongoose.connect(
      'mongodb+srv://rebelthyworld:Forgot%402692_@cluster0.mq49lnp.mongodb.net/test-messagesDb?retryWrites=true&w=majority&appName=Cluster0'
    )
    .then(result => {
      // console.log('mongoose connected');
      const user = new User({
        email: 'test@test.com',
        password: 'tester',
        name: 'Test',
        post: [],
        _id: '5c0f66b979af55031b34728a', 
      });
      return user.save();
    })
    .then((user) => {
      console.log('user saved', user);
      const req = {userId: '5c0f66b979af55031b34728a'}
      const res = {
        statusCode: 500,
        userStatus: null,
        status: function(code) {
          this.statusCode = code;
          return this;
        }, 
        json: function(data) {
          this.userStatus = data.status
        }
      }
      AuthController.getUserStatus(req, res, () => {})
      .then((r) => {
        console.log('undef', r)
        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.equal('I am new!');
        User.deleteMany({}).then(() => {
          return mongoose.disconnect()
        })
        .then(() => {
          done();
        })
      })
    })
    .catch(err => {
      console.log('what is err');
      console.log(err);
    })
  })
})