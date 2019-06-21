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
          console.log('Data result: ', result.rows[0]);
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
  static async updateCar(req, res) {
    if(!req.body.newPrice) {
      return res.status(400).send({ message: 'Please enter the car price'});
    }
    const id = parseInt(req.params.id);
    const data = {
      price: req.body.newPrice,
    };
    try {
      await pool.connect((err, client, done) => {
        const qryGetCar = 'SELECT * FROM cars WHERE id=$1';
        client.query(qryGetCar, [req.params.id], (error, result) => {
          done();
          if(error) {
            res.status(400).json({ status: 400, message: error });
          }
          if(!result.rows[0]) {
            return res.status(404).json({ status: 404, message: 'Car not found' });
          }
          try {
            pool.connect((err, client, done) => {
              const query = 'UPDATE cars SET price=$1 WHERE id=$2 RETURNING id, owner_id, created_on, manufacturer, model, price, state, status';
              const values = [data.price, req.params.id];
              client.query(query, values, (error, result) => {
                done();
                if(error) {
                  res.status(400).json({status: 400, message: error });
                }
                return res.status(200).json({
                  status: 200,
                  message: 'Car price successfully updated',
                  data: {
                    id: result.rows[0].id,
                    owner_id: result.rows[0].owner_id,
                    created_on: result.rows[0].created_on,
                    manufacturer: result.rows[0].manufacturer,
                    model: result.rows[0].model,
                    price: result.rows[0].price,
                    state: result.rows[0].state,
                    status: result.rows[0].status
                  }
                });
              })

            });
          }
          catch(error) {
            return res.status(400).send(error);
          }
        })
      })
    }
    catch(error) {
      return res.status(400).send(error);
    }
  }
  static async viewSpecificCar(req, res) {
    try {
      await pool.connect((err, client, done) => {
        const qryGetCar = 'SELECT * FROM cars WHERE id=$1';
        client.query(qryGetCar, [req.params.id], (error, result) => {
          if(error) {
            return res.status(400).json({status: 400, message: error});            
          }
          if(!result.rows[0]) {
            return res.state(404).json({status: 404, message: 'Car not found, Enter a valid car id'});
          }
          return res.status(200).json({
            status: 200,
            data: {
              id: result.rows[0].id,
              owner_id: result.rows[0].owner_id,
              created_on: result.rows[0].created_on,
              state: result.rows[0].state,
              status: result.rows[0].status,
              price: result.rows[0].price, 
              manufacturer: result.rows[0].manufacturer,
              model: result.rows[0].model,     
              body_type: result.rows[0].body_type,                   
            }
          });
        });
      });
    }
    catch(error) {
      return res.status(400).send(error);
    }
  }
  static async viewAllUnsoldCars(req, res){
    try {       
      await pool.connect((err, client, done) => {
        const qryGetCar = 'SELECT * FROM cars WHERE status=$1 ORDER BY ID ASC';        
        client.query(qryGetCar, [req.params.status], (error, result) => {
          done();
          if(!result.rows[0]) {
            return res.status(404).json({status: 404, message: 'No car found with such status'});
          }
          return res.status(200).json({
            status: 200,
            data: result.rows
          });
        });
      });
    }
    catch(error) {
      return res.status(400).send(error);
    }
  }
}

export default carController;
