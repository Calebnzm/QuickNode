import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './database.js';
import userRoutes from './routes/userRoutes.js';
import dotenv from 'dotenv';


dotenv.config();

const app = express();


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