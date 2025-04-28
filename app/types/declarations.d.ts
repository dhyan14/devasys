// This file provides type declarations for modules that don't have built-in type definitions

declare module 'react';
declare module 'react-datepicker';
declare module 'react-icons/*';
declare module 'next/link';
declare module 'react-hot-toast';

// Node.js global declarations
declare namespace NodeJS {
  interface Global {
    mongoose: any;
  }
  interface ProcessEnv {
    MONGODB_URI: string;
    JWT_SECRET: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}

// Declare EdgeRuntime for conditional Node.js vs Edge checks
declare const EdgeRuntime: string | undefined; 