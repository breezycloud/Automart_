import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../server/server';

chai.use(chaiHttp);
const { expect } = chai;
chai.should();

describe('User Test', () => {
  describe('POST request: create new user', () => {
    const user = {
      first_name: 'Musa',
      last_name: 'Ali',
      email: 'aminualee13@gmail.com',
      password: 'musa',
    };
    it('should be able to create new user', (done) => {
      chai.request(app)
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
  describe('GET request: user login', () => {
    const userCredentials = {
      email: 'aminuali13@gmail.com',
      password: 'aminu'
    };
    it('registered user should be able to login', async () => {
      chai.request(app)
      .get('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(userCredentials)
      .end((err, res) => {
        expect(200);
      });
    })

  })
});
