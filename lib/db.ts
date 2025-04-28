// Always force Node.js runtime
export const runtime = 'nodejs';

// Only load mongoose in Node.js context to prevent Edge Runtime errors
let mongoose: any;

// This check prevents edge runtime from loading mongoose
if (typeof EdgeRuntime === 'undefined') {
  try {
    // Load the mongoose-loader first to ensure environment is ready
    require('../mongoose-loader');
    // Then import mongoose
    mongoose = require('mongoose');
  } catch (error) {
    console.error('Failed to import mongoose', error);
    // Provide a fallback for TypeScript
    mongoose = { 
      connect: () => Promise.resolve(null),
      Schema: class {},
      model: () => ({})
    };
  }
}

// Global type for mongoose cache
declare global {
  var mongoose: {
    conn: any | null;
    promise: Promise<any> | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://devloperasys:devloperasys@asys.6o7l3r1.mongodb.net/';

// Initialize the cached connection
// This will be skipped in Edge Runtime environments
let cached = { conn: null, promise: null };
if (typeof global !== 'undefined') {
  cached = global.mongoose || { conn: null, promise: null };
  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }
}

export async function connectToDatabase() {
  // Only run in Node.js environment
  if (typeof EdgeRuntime !== 'undefined') {
    console.warn('Attempted to connect to database from Edge Runtime');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose: any) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
} 