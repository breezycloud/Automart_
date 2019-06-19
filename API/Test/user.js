import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../server/server';

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
    it('should be able to create new user', async () => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(user)
        .end((err, res) => {
          expect(201);
        });
    });
  });
});
