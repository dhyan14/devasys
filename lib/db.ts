// Always force Node.js runtime
export const runtime = 'nodejs';

// Only load mongoose in Node.js context to prevent Edge Runtime errors
let mongoose: any;

// Check if we're in an Edge Runtime
let isEdgeRuntime = false;
try {
  // @ts-ignore - EdgeRuntime may not be defined in all environments
  isEdgeRuntime = typeof EdgeRuntime !== 'undefined';
} catch (e) {
  // Not in edge runtime
}

// Only import mongoose in Node.js context
if (!isEdgeRuntime) {
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

// Define cache type interface
interface MongooseCache {
  conn: any | null;
  promise: Promise<any> | null;
}

// Global type for mongoose cache
declare global {
  var mongoose: MongooseCache | undefined;
}

// Use MongoDB Atlas URI for deployment, fallback to local for development
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://devloperasys:devloperasys@asys.6o7l3r1.mongodb.net/attendance-system';

// Initialize the cached connection
// This will be skipped in Edge Runtime environments
let cached: MongooseCache = { conn: null, promise: null };
if (typeof global !== 'undefined') {
  cached = (global.mongoose as MongooseCache) || { conn: null, promise: null };
  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }
}

export async function connectToDatabase() {
  // Only run in Node.js environment
  if (isEdgeRuntime) {
    console.warn('Attempted to connect to database from Edge Runtime');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  console.log('Connecting to MongoDB at', MONGODB_URI.replace(/\/\/([^:]+):[^@]+@/, '//***:***@')); // Hide credentials in logs

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose: any) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      })
      .catch((err: any) => {
        console.error('MongoDB connection error:', err);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
} 