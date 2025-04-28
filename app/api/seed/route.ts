import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { hashPassword } from '@/lib/auth';

export const runtime = 'nodejs';

// Demo users data
const demoUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Faculty Smith',
    email: 'faculty@example.com',
    password: 'faculty123',
    role: 'faculty',
  },
  {
    name: 'Student Jones',
    email: 'student@example.com',
    password: 'student123',
    role: 'student',
    facultyId: null, // Will be set after faculty creation
  },
  {
    name: 'Parent Brown',
    email: 'parent@example.com',
    password: 'parent123',
    role: 'parent',
    studentId: null, // Will be set after student creation
  },
];

interface ResultItem {
  message: string;
  user?: {
    id: any;
    name: string;
    email: string;
    role: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Clear existing users if needed (uncomment if you want to reset users)
    // await User.deleteMany({});

    const results: ResultItem[] = [];
    let facultyUser: any = null;
    let studentUser: any = null;

    // Create users in sequence
    for (const userData of demoUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        results.push({ 
          message: `User ${userData.email} already exists`,
          user: {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
          }
        });
        
        // Store references for relationships
        if (userData.role === 'faculty') {
          facultyUser = existingUser;
        } else if (userData.role === 'student') {
          studentUser = existingUser;
        }
        
        continue;
      }

      // Set relationships if needed
      if (userData.role === 'student' && facultyUser) {
        userData.facultyId = facultyUser._id;
      } else if (userData.role === 'parent' && studentUser) {
        userData.studentId = studentUser._id;
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);

      // Create user
      const newUser = new User({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        studentId: userData.studentId,
        facultyId: userData.facultyId,
      });

      await newUser.save();

      results.push({ 
        message: `User ${userData.email} created successfully`,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        }
      });

      // Store references for relationships
      if (userData.role === 'faculty') {
        facultyUser = newUser;
      } else if (userData.role === 'student') {
        studentUser = newUser;
      }
    }

    // Update relationships if needed
    if (facultyUser && studentUser) {
      const updatedStudent = await User.findByIdAndUpdate(
        studentUser._id,
        { facultyId: facultyUser._id },
        { new: true }
      );
      
      if (updatedStudent) {
        results.push({ message: 'Updated student with faculty reference' });
      }
    }

    if (studentUser) {
      const parentUser = await User.findOne({ role: 'parent' });
      if (parentUser && !parentUser.studentId) {
        const updatedParent = await User.findByIdAndUpdate(
          parentUser._id, 
          { studentId: studentUser._id },
          { new: true }
        );
        
        if (updatedParent) {
          results.push({ message: 'Updated parent with student reference' });
        }
      }
    }

    return NextResponse.json({ 
      message: 'Demo users created successfully',
      results 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { message: 'An error occurred during seeding', error: String(error) },
      { status: 500 }
    );
  }
} 