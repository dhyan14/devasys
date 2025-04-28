// This file is used by Next.js to register Node.js
// See https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

export async function register() {
  // This code runs before any route is processed
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Only run on Node.js runtime
    await import('./lib/db');
  }
}

export const runtime = 'nodejs'; 