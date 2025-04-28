export const runtime = 'nodejs';

let bcryptjs: any;
let jose: any;
let nextCookies: any;
let nextServer: any;
let userModel: any;
let dbConnector: any;

if (typeof EdgeRuntime === 'undefined') {
  try {
    require('../mongoose-loader');
    
    bcryptjs = require('bcryptjs');
    jose = require('jose');
    nextCookies = require('next/headers');
    nextServer = require('next/server');
    
    const User = require('@/models/User').User;
    const db = require('./db');
    
    userModel = User;
    dbConnector = db.connectToDatabase;
  } catch (error) {
    console.error('Failed to import auth dependencies', error);
  }
}

const compare = (password: string, hashedPassword: string) => 
  bcryptjs?.compare(password, hashedPassword) || Promise.resolve(false);
const hash = (password: string, saltRounds: number) => 
  bcryptjs?.hash(password, saltRounds) || Promise.resolve('hashed_' + password);

const secretKey = typeof process !== 'undefined' ? 
  new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key_change_this_in_production') :
  new TextEncoder().encode('default_secret_key_change_this_in_production');

const key = { kty: 'oct', k: typeof Buffer !== 'undefined' ? Buffer.from(secretKey).toString('base64') : '' };

export async function hashPassword(password: string) {
  return await hash(password, 10);
}

export async function comparePasswords(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword);
}

export async function createToken(userId: string, role: string) {
  if (!jose) return 'mock_token_' + userId;
  
  return await new jose.SignJWT({ userId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(secretKey);
}

export async function verifyToken(token: string) {
  try {
    if (!jose) return null;
    
    const { payload } = await jose.jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  if (typeof EdgeRuntime !== 'undefined') return null;
  
  try {
    const cookieStore = nextCookies?.cookies();
    const token = cookieStore?.get('token')?.value;
    
    if (!token) return null;
    
    const verifiedToken = await verifyToken(token);
    if (!verifiedToken) return null;
    
    await dbConnector?.();
    const user = await userModel?.findById(verifiedToken.userId).select('-password').lean();
    
    if (!user) return null;
    
    return {
      user,
      role: verifiedToken.role,
    };
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

export async function getUserFromRequest(req: any) {
  if (typeof EdgeRuntime !== 'undefined') return null;
  
  try {
    const token = req.cookies.get('token')?.value;
    
    if (!token) return null;
    
    const verifiedToken = await verifyToken(token);
    if (!verifiedToken) return null;
    
    await dbConnector?.();
    const user = await userModel?.findById(verifiedToken.userId).select('-password').lean();
    
    if (!user) return null;
    
    return {
      user,
      role: verifiedToken.role,
    };
  } catch (error) {
    console.error('User from request error:', error);
    return null;
  }
} 