import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongo'; // Update the path if needed

export async function GET() {
  try {
    const db = await connectDB();
    const collections = await db.listCollections().toArray();
    return NextResponse.json({ message: 'Connected to MongoDB!', collections });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      { message: 'Error connecting to MongoDB', error },
      { status: 500 },
    );
  }
}
