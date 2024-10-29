import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
// mongoose.set('debug', true); // Enable mongoose debug mode

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch(err) {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    }
};

export default connectDB;
