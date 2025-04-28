import { compare, hash } from 'bcryptjs';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { User } from '@/models/User';
import { connectToDatabase } from './db';

export const runtime = 'nodejs';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key_change_this_in_production');
const key = { kty: 'oct', k: Buffer.from(secretKey).toString('base64') };

export async function hashPassword(password: string) {
  return await hash(password, 10);
}

export async function comparePasswords(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword);
}

export async function createToken(userId: string, role: string) {
  return await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(secretKey);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) return null;
  
  const verifiedToken = await verifyToken(token);
  if (!verifiedToken) return null;
  
  await connectToDatabase();
  const user = await User.findById(verifiedToken.userId).select('-password').lean();
  
  if (!user) return null;
  
  return {
    user,
    role: verifiedToken.role,
  };
}

export async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  
  if (!token) return null;
  
  const verifiedToken = await verifyToken(token);
  if (!verifiedToken) return null;
  
  await connectToDatabase();
  const user = await User.findById(verifiedToken.userId).select('-password').lean();
  
  if (!user) return null;
  
  return {
    user,
    role: verifiedToken.role,
  };
} 