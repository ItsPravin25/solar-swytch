import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'fs';
import path from 'path';

async function start() {
  console.log('Starting MongoDB Memory Server...');
  
  const mongod = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbName: 'solar_swytch',
      // This will persist data in a local folder during the session
      // but it's still "in-memory" in terms of how it's managed.
      // For a truly persistent local DB, we'd use a real MongoDB install.
    }
  });

  const uri = mongod.getUri();
  console.log(`MongoDB started at: ${uri}`);
  console.log('Press Ctrl+C to stop the database.');

  // Keep the process alive
  process.on('SIGINT', async () => {
    await mongod.stop();
    console.log('\nMongoDB stopped.');
    process.exit(0);
  });
}

start().catch(err => {
  console.error('Failed to start MongoDB Memory Server:', err);
  process.exit(1);
});
