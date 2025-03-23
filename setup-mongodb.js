// Script to create GotraBandhus database and initial collections
import { MongoClient } from 'mongodb';

// Connection URI (using 127.0.0.1 which is what the MongoDB server is bound to)
const uri = 'mongodb://127.0.0.1:27017/GotraBandhus';

async function createDatabase() {
  const client = new MongoClient(uri);
  
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB server");
    
    // Create/use the GotraBandhus database
    const db = client.db('GotraBandhus');
    console.log("Using database: GotraBandhus");
    
    // Create users collection
    await db.createCollection('users');
    console.log("Created 'users' collection");
    
    // Create relationships collection
    await db.createCollection('relationships');
    console.log("Created 'relationships' collection");
    
    // Print connection string
    console.log(`\nMongoDB connection URI: ${uri}`);
    
    return uri;
  } catch (err) {
    console.error("Error setting up database:", err);
  } finally {
    await client.close();
    console.log("Database connection closed");
  }
}

createDatabase()
  .then(uri => console.log("Setup complete. Connection URI:", uri))
  .catch(err => console.error("Failed to set up database:", err));