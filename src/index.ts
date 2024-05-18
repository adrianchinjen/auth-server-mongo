import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.route';
import { CustomErrorHandler } from './middlewares/ErrorHandler';

require('dotenv').config({ path: '.env.development' });

const app = express();
const mongoUrl = process.env.MONGO_URL;
const dbname = process.env.DB_NAME;
const port = process.env.SERVER_PORT;

app.use(cookieParser());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);

app.use(CustomErrorHandler);

const connect = async () => {
  try {
    await mongoose.connect(`${mongoUrl}${dbname}`);
    console.log(`MongoDB has been initialized on DB url ${mongoUrl}`);
  } catch (error) {
    console.log(error);
    console.log('There is an error when connecting to database');
  }
};

app.listen(port, () => {
  connect();
  console.log('Auth server running on port', port);
});
