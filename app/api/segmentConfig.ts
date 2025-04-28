// This file marks all API routes to use Node.js runtime
export const runtime = 'nodejs';

// Force all API routes to use Node.js runtime for MongoDB operations
export const preferredRegion = 'auto';

// Export a helper function to check if code is running in Edge Runtime
export function isEdgeRuntime() {
  return typeof EdgeRuntime !== 'undefined';
}

// Export a helper function to safely require modules
export function safeRequire(moduleName: string) {
  if (isEdgeRuntime()) return null;
  
  try {
    return require(moduleName);
  } catch (error) {
    console.error(`Failed to require ${moduleName}`, error);
    return null;
  }
} 