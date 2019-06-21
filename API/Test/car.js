import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../server/server';

chai.use(chaiHttp);
const { expect } = chai;
chai.should();

describe('Car Test', () => {
  describe('POST request: create new car ad', () => {
    const car = {
      manufacturer: 'Toyota',
      model: 'Camry 2012',
      body_type: 'Saloon',
      state: 'New',
      status: 'Available',
      price: '4500',
    };
    it('should be able to create new car ad', async () => {
      chai.request(app)
        .post('/api/v1/car')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(car)
        .end((err, res) => {
          expect(201);
        });
    });
  });
});
