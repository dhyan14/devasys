// This file ensures mongoose is only loaded in Node.js context
// It will be imported by API routes and middleware

// Skip in edge runtime
if (typeof EdgeRuntime === 'undefined') {
  try {
    console.log('Loading mongoose in Node.js environment');
    // Attempt to require mongoose to validate it works in this environment
    require('mongoose');
  } catch (error) {
    console.error('Failed to load mongoose', error);
  }
}

module.exports = {
  ensureLoaded: true
}; 