import mongoose from 'mongoose';

const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB Connected');
  }).catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
};

export default connectDB;