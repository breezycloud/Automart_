import uuidv4 from 'uuid/v4';
import Helper from '../middlewares/Helper';
import { pool } from '../services/db';

class carController {
  static async postNewAd(req, res) {
    if (!req.body.manufacturer) {
      return res.status(400).send({ message: 'Some values are missing' });
    }
    if(!req.body.model){
        return res.status(400).send({ message: 'Car model is required'});
    }
    if(!req.body.price){
        return res.status(400).send({ message: 'Please provide car price' });
    }
    if(!req.body.state){
        return res.status(400).send({ message: 'Provide state of the car' });
    }
    if(!req.body.status){
        return res.status(400).send({ message: 'Please provide car status' });
    }
    else if(req.body.status != 'Available' && req.body.status != 'available') {
      return res.status(400).send({ message: 'Car status should only be Available!' });
    }


    const qryCreateAd = `INSERT INTO cars(owner_id, manufacturer, model, body_type, state, status, price) 
        VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [
        req.user.id,
        req.body.manufacturer,
        req.body.model,
        req.body.body_type,
        req.body.state,
        req.body.status,
        req.body.price
    ];

    try {
       await pool.connect((err, client, done) => {
        client.query(qryCreateAd, values, (error, result) => {
          done();
          if (error) {
            res.status(400).json({ status: 400, message: error });
          }          
          return res.status(201).send({ status: 201, message: 'Car advert successfully posted', data: result.rows[0] });
        });
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  }
}

export default carController;
