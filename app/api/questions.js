import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

let cachedClient = null;
let cachedDb = null;

// Connect to MongoDB
async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// API Route to get questions from MongoDB
export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const collection = db.collection('questions');

  try {
    const questions = await collection.find({}).toArray(); // Fetch all questions
    res.status(200).json(questions); // Send the questions as JSON response
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
}
