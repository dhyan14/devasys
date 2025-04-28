import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

// Get all users
export async function GET(request: NextRequest) {
  try {
    console.log("API: Starting GET request to /api/admin/users");
    
    // Connect to the database first to ensure connection is established
    console.log("API: Connecting to MongoDB...");
    await connectToDatabase();
    console.log("API: MongoDB connection successful");

    // Check if user is admin
    try {
      const session = await getSession();
      if (!session || session.role !== 'admin') {
        console.log("API: Unauthorized access attempt - user is not admin");
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 401 }
        );
      }
    } catch (sessionError) {
      console.error('API: Session check error:', sessionError);
      // Continue even if session check fails in development
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { message: 'Authentication error' },
          { status: 401 }
        );
      }
    }

    // Get users (exclude password)
    console.log("API: Fetching users from MongoDB...");
    const users = await User.find().select('-password').lean();
    console.log(`API: Found ${users.length} users in database`);

    return NextResponse.json({ users });
  } catch (error) {
    console.error('API: Error fetching users:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching users' },
      { status: 500 }
    );
  }
}

// Create a new user
export async function POST(req: Request) {
  try {
    // Check if user is admin
    const session = await getSession();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admin can create users.' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Parse the request body
    const { name, email, password, role, profilePicture, studentId, facultyIds, enrollmentNumber } =
      await req.json();

    // Check if all required fields are present
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Name, email, password, and role are required.' },
        { status: 400 }
      );
    }

    // Check if role is valid
    if (!['admin', 'faculty', 'student', 'parent'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Role must be admin, faculty, student, or parent.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists.' },
        { status: 400 }
      );
    }

    // Validate student ID if role is parent
    if (role === 'parent' && !studentId) {
      return NextResponse.json(
        { error: 'Student ID is required for parent role.' },
        { status: 400 }
      );
    }

    // Validate faculty IDs if provided
    if (facultyIds && !Array.isArray(facultyIds)) {
      return NextResponse.json(
        { error: 'Faculty IDs must be an array.' },
        { status: 400 }
      );
    }

    // Check if enrollment number is provided for student role
    if (role === 'student' && !enrollmentNumber) {
      return NextResponse.json(
        { error: 'Enrollment number is required for student role.' },
        { status: 400 }
      );
    }

    // Check if enrollment number is unique for student role
    if (role === 'student' && enrollmentNumber) {
      const existingEnrollment = await User.findOne({ enrollmentNumber });
      if (existingEnrollment) {
        return NextResponse.json(
          { error: 'User with this enrollment number already exists.' },
          { status: 400 }
        );
      }
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profilePicture: profilePicture || '',
      studentId: role === 'parent' ? studentId : undefined,
      facultyIds: role === 'student' ? facultyIds : undefined,
      enrollmentNumber: role === 'student' ? enrollmentNumber : undefined,
    });

    // Save the user to the database
    await newUser.save();

    // Return the new user without the password
    const userWithoutPassword = { ...newUser.toObject() };
    delete userWithoutPassword.password;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user.' },
      { status: 500 }
    );
  }
} 