import express from 'express';
import bodyParser from 'body-parser';
import userController from '../controllers/user';


const app = express();

const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/api/v1/auth/signup', userController.createUser);
app.get('/api/v1/auth/login', userController.userLogin);

app.use('*', (req, res) => res.status(200).json({
  message: 'Welcome Breezy Cloud',
}));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

export default app;