import mongoose from 'mongoose';

const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    // If we're already connected to MongoDB, return the existing connection
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI  || "", {
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export default connectToDatabase;
