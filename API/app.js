import express from 'express';
import bodyParser from 'body-parser';
import userController from './controllers/user';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/v1/auth/signup', userController.createUser);

app.use('*', (req, res) => res.status(200).json({
  message: 'Welcome Breezy Cloud',
}));

export default app;
