const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fashion_shopping';
  try {
    console.log(`Connecting to MongoDB at: ${uri}...`);
    // Set a short server selection timeout so fallback triggers quickly if local mongod is down
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Local MongoDB connection failed (${error.message}). Initializing In-Memory Mongo Server fallback...`);
    try {
      mongod = await MongoMemoryServer.create();
      const mongoUri = mongod.getUri();
      console.log(`In-Memory MongoDB started at: ${mongoUri}`);
      const conn = await mongoose.connect(mongoUri);
      console.log(`In-Memory MongoDB Connected successfully!`);

      // Trigger automatic seeding for in-memory database
      const { seedInline } = require('../seed');
      await seedInline();
    } catch (memError) {
      console.error('Failed to initialize MongoDB Memory Server:', memError);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
