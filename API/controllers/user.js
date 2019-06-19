import uuidv4 from 'uuid/v4';
import Helper from '../middlewares/Helper';
import { pool } from '../services/db';

class userController {
  static async createUser(req, res) {
    if (!req.body.email) {
      return res.status(400).send({ message: 'Email is required' });
    }
    if (!req.body.password) {
      return res.status(400).send({ message: 'Some values are missing' });
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400).send({ message: 'Please enter a valid email address' });
    }

    const hashPassword = Helper.hashPassword(req.body.password);
    console.log('check encryption', hashPassword);

    const qryCreateUser = `INSERT INTO users(user_id, first_name, last_name, email, pwd) 
        VALUES($1, $2, $3, $4, $5) RETURNING user_id`;
    const values = [
      uuidv4(),
      req.body.first_name,
      req.body.last_name,
      req.body.email,
      hashPassword,
    ];
    console.log('check result saved: ', values);
    try {
       await pool.connect((err, client, done) => {
        client.query(qryCreateUser, values, (error, result) => {
          done();
          if (error) {
            res.status(400).json({ status: 400, message: error });
          }
          const token = Helper.generateToken(result.rows[0]);
          return res.status(201).send({ token, message: 'User created successfully' });
        });
      });
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ message: 'User with that EMAIL already exist' });
      }
      return res.status(400).send(error);
    }
  }
}

export default userController;
