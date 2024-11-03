import mongoose from 'mongoose';

export const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/analytics-dashboard');
    console.log('Connected to MongoDB');
  } catch (err) {
    if (retries > 0) {
      console.log(`MongoDB connection failed. Retrying... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      console.error('MongoDB connection failed after all retries:', err);
      process.exit(1);
    }
  }
};