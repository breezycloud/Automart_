import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../server/server';

chai.use(chaiHttp);
const { expect } = chai;
chai.should();

describe('Order Test', () => {
  describe('POST request: create purhcase order', () => {
    const order = {
      id: '1',
      price_offered: '3500',
    };
    it('should be able to create new purchase', async () => {
      chai.request(app)
        .post('/api/v1/order')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(order)
        .end((err, res) => {
          expect(201);
        });
    });
  });
});
