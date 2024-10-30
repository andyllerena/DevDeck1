'use client'; // Mark this as a Client Component

import { useEffect, useState } from 'react';

interface Collection {
  name: string;
}

const TestMongo = () => {
  const [message, setMessage] = useState('');
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/test-mongo'); // Call the server-side API route
        const data = await response.json(); // Parse the response data
        setMessage(data.message); // Set success message
        setCollections(data.collections || []); // Set the collections data
      } catch (error) {
        setMessage('Error fetching data from MongoDB');
        console.error('Error:', error); // Log any error in the console
      }
    };

    fetchData(); // Fetch data from the API route when the component mounts
  }, []);

  return (
    <div>
      <h1>{message}</h1>
      {collections.length > 0 ? (
        <ul>
          {collections.map((collection, index) => (
            <li key={index}>{collection.name}</li> // Display each collection name
          ))}
        </ul>
      ) : (
        <p>No collections found.</p> // Display message if no collections are found
      )}
    </div>
  );
};

export default TestMongo;
