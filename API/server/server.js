import express from 'express';
import bodyParser from 'body-parser';
import userController from '../controllers/user';
import carController from '../controllers/car';
import orderController from '../controllers/order';
import Auth from '../middlewares/Auth';



const app = express();

const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/api/v1/auth/signup', userController.createUser);
app.get('/api/v1/auth/login', userController.userLogin);
app.post('/api/v1/car', Auth.verifyToken, carController.postNewAd)
app.post('/api/v1/order',  orderController.createOrder);

app.use('*', (req, res) => res.status(404).json({
  message: 'Route not found,Please the enter the correct link to continue'
}));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

export default app;
