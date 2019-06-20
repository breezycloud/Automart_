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

    const qryCreateAd = `INSERT INTO cars(id, owner_id, manufacturer, model, body_type, state, status, price) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
    const values = [
        uuidv4(),
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
           console.log('api values: ', values)
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
  static async userLogin(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ message: 'Some values are missing'});
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400).send({ message: 'Please enter a valid email address' });
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400).send({ message: 'Please enter a valid email address' });
    }

    const qryGetUser = `SELECT * FROM users WHERE email=$1`;
    const values = [
      req.body.email
    ];
    try {
      await pool.connect((err, client, done) => {
       client.query(qryGetUser, values, (error, result) => {
         done();
         if (error) {
           res.status(400).json({ status: 400, message: error });
         }
         else if(!result.rows[0]){
          return res.status(400).send({'message': 'The credentials you provided is incorrect'});
         }
         else if (!Helper.comparePassword(result.rows[0].pwd, req.body.password)) {
          return res.status(400).send({ message: 'The credentials you provided is incorrect' });
         }
         const token = Helper.generateToken(result.rows[0].user_id);
         return res.status(200).send({ token });
       });
     });
    } catch (error) {
     return res.status(400).send(error);
   }
  }
}

export default carController;
