const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const authMiddleWare = require('../middleware/is-auth');

describe('Auth Middleware', () => {
  it('should throw error if no authorization header is present', () => {
    const req = {
      get: (headerName) => {
        return null;
      }
    }

    expect(authMiddleWare.bind(this, req, {}, () => {})).to.throw('Not authenticated')
  })
  it('should throw error if authorization header is only one string', () => {
    const req = {
      get: (headerName) => {
        return 'xyz';
      }
    }

    expect(authMiddleWare.bind(this, req, {}, () => {})).to.throw('')
  })

  it('should throw error if token cant be verified', () => {
    const req = {
      get: (headerName) => {
        return 'Bearer xyx';
      }
    }
    expect(authMiddleWare.bind(this, req, {}, () => {})).to.throw('')
  })

  it('should yield a user Id after decoding the token', () => {
    const req = {
      get: (headerName) => {
        return 'Bearer lsklakslakslakslk';
      }
    }
    sinon.stub(jwt, 'verify');
    jwt.verify.returns({
      userId: 'abc'
    })
    authMiddleWare(req, {}, () => {})
    expect(req).to.have.property('userId');
    expect(req).to.have.property('userId', 'abc');
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  })
})



