// This file provides type declarations for modules that don't have built-in type definitions

declare module 'react';
declare module 'react-datepicker';

// Fix for react-icons
declare module 'react-icons/fi' {
  // Define icon props that include className
  export interface IconBaseProps {
    size?: string | number;
    color?: string;
    title?: string;
    className?: string;
    style?: React.CSSProperties;
    attr?: React.SVGAttributes<SVGElement>;
  }

  export type IconType = React.FC<IconBaseProps>;

  export const FiEdit2: IconType;
  export const FiTrash2: IconType;
  export const FiUserPlus: IconType;
  export const FiSearch: IconType;
  export const FiCalendar: IconType;
  export const FiUsers: IconType;
  export const FiUserCheck: IconType;
  export const FiUserX: IconType;
  export const FiBook: IconType;
  export const FiX: IconType;
  export const FiCheck: IconType;
  export const FiSave: IconType;
}

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