import { MongoClient } from 'mongodb';

// Provide a fallback or throw an error if MONGO_URI is undefined
const uri = process.env.MONGO_URI as string | undefined;

if (!uri) {
  throw new Error(
    'MongoDB connection URI is missing in the environment variables.',
  );
}

const client = new MongoClient(uri);

let db: any;

export async function connectDB() {
  if (!db) {
    try {
      await client.connect();
      db = client.db('devdeck');
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection failed:', error);
    }
  }
  return db;
}
