// Use a dynamic import for mongoose in Node.js context
let mongoose: any;

// Explicitly set Node.js runtime
export const runtime = 'nodejs';

// This will be initialized in connectToDatabase
declare global {
  var mongoose: {
    conn: any | null;
    promise: Promise<any> | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://devloperasys:devloperasys@asys.6o7l3r1.mongodb.net/';

let cached = global.mongoose || { conn: null, promise: null };

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Dynamic import of mongoose only when needed
    mongoose = (await import('mongoose')).default;
    
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose: any) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
} 