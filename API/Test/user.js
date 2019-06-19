const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;

describe('User Test', () => {
  describe('POST request: create new user', () => {
    const user = {
      first_name: 'Musa',
      last_name: 'Ali',
      email: 'aminualee13@gmail.com',
      password: 'musa',
    };
    it('should be able to create new user', (done) => {
      chai.request('http://localhost:8000')
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(user)
        .end((err, res) => {
          expect(201);
        });
      done();
    });
  });
});
