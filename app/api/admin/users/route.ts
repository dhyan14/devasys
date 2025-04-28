import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

// Get all users
export async function GET(request: NextRequest) {
  try {
    // Connect to the database first to ensure connection is established
    await connectToDatabase();

    // Check if user is admin
    try {
      const session = await getSession();
      if (!session || session.role !== 'admin') {
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 401 }
        );
      }
    } catch (sessionError) {
      console.error('Session check error:', sessionError);
      // Continue even if session check fails in development
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { message: 'Authentication error' },
          { status: 401 }
        );
      }
    }

    // Get users (exclude password)
    const users = await User.find().select('-password').lean();

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching users' },
      { status: 500 }
    );
  }
}

// Create a new user
export async function POST(request: NextRequest) {
  try {
    // Connect to the database first
    await connectToDatabase();

    // Check if user is admin
    try {
      const session = await getSession();
      if (!session || session.role !== 'admin') {
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 401 }
        );
      }
    } catch (sessionError) {
      console.error('Session check error:', sessionError);
      // Continue even if session check fails in development
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { message: 'Authentication error' },
          { status: 401 }
        );
      }
    }

    const body = await request.json();
    const { name, email, password, role, studentId, facultyId } = body;

    // Validate inputs
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: 'Name, email, password, and role are required' },
        { status: 400 }
      );
    }

    // Role validation
    const validRoles = ['admin', 'faculty', 'student', 'parent'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role' },
        { status: 400 }
      );
    }

    // Parent must provide a studentId
    if (role === 'parent' && !studentId) {
      return NextResponse.json(
        { message: 'Student ID is required for parent registration' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      studentId: role === 'parent' ? studentId : undefined,
      facultyId: role === 'student' ? facultyId : undefined,
    });

    await newUser.save();

    // Return success without sensitive data
    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'An error occurred while creating the user' },
      { status: 500 }
    );
  }
} 