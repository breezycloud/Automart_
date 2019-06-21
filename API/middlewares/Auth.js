import jwt from 'jsonwebtoken';
import { pool } from '../services/db';

class Auth {
  static async verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(400).send({ message: 'Token is not provided' });
    }
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      const qryGetUser = 'SELECT * FROM users WHERE user_id=$1';
      await pool.connect((err, client, done) => {
        client.query(qryGetUser, [decoded.userId], (error, result) => {
          done();
          if (error) {
            res.status(400).json({ status: 400, message: error });
          }
          if (!result.rows[0]) {
            return res.status(400).send({ message: 'The token you provided is invalid' });
          }
          req.user = { id: decoded.userId };
          next();
        });
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  }
}

export default Auth;
