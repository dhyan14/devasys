// This file ensures mongoose is only loaded in Node.js context
// It will be imported by API routes and middleware

// Skip in edge runtime - handle different ways to detect EdgeRuntime
let isEdgeRuntime = false;
try {
  // Check for the Edge Runtime environment
  isEdgeRuntime = typeof process !== 'undefined' && 
                 process.env.NEXT_RUNTIME === 'edge' || 
                 typeof EdgeRuntime !== 'undefined';
} catch (e) {
  // EdgeRuntime is not defined, which means we're not in an Edge environment
}

if (!isEdgeRuntime) {
  try {
    console.log('Loading mongoose in Node.js environment');
    
    // Display environment variables for debugging
    console.log('MongoDB URI env var exists:', !!process.env.MONGODB_URI);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    // Attempt to require mongoose to validate it works in this environment
    const mongoose = require('mongoose');
    console.log('Mongoose version:', mongoose.version);
    
    // Export mongoose to ensure it's accessible
    module.exports = {
      ensureLoaded: true,
      mongoose
    };
  } catch (error) {
    console.error('Failed to load mongoose', error);
    
    module.exports = {
      ensureLoaded: false,
      error: error.message
    };
  }
} else {
  console.log('Skipping mongoose loader in Edge Runtime');
  
  module.exports = {
    ensureLoaded: false,
    reason: 'EdgeRuntime detected'
  };
} 