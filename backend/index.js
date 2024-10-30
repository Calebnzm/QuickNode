import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './database.js';
import userRoutes from './routes/userRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

dotenv.config();

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173', // Frontend URL
    methods: ['GET', 'POST'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(morgan('dev')); // Logging middleware


app.use(express.json());

connectDB();

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Crypto Payment Server!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is runnig on port ${PORT}`);
});