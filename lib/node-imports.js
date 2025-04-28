// This file ensures all database operations are run in Node.js context
// and not in Edge runtime

// Import mongoose only in Node.js environment
if (process.env.NEXT_RUNTIME === 'nodejs') {
  require('mongoose');
}

// Export dummy function to prevent tree-shaking
module.exports = {
  ensureNodeImports: () => {
    console.log('Node.js imports loaded');
  }
}; 