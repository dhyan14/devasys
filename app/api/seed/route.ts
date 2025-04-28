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
    console.log("Starting seed process...");
    console.log("Environment:", process.env.NODE_ENV);
    
    // Try to connect to the database
    console.log("Connecting to MongoDB...");
    try {
      const conn = await connectToDatabase();
      console.log("MongoDB connection result:", conn ? "Connected" : "Failed to connect");
      
      // Check Atlas connectivity
      if (conn) {
        try {
          const admin = conn.connection.db.admin();
          const info = await admin.serverInfo();
          console.log("MongoDB Server Info:", {
            version: info.version,
            gitVersion: info.gitVersion
          });
        } catch (infoError) {
          console.log("Could not retrieve MongoDB server info", infoError);
        }
      }
    } catch (dbError) {
      console.error("MongoDB connection error:", dbError);
      return NextResponse.json({
        message: 'Failed to connect to MongoDB',
        error: String(dbError)
      }, { status: 500 });
    }
    
    console.log("Checking if User model is available...");
    if (!User || typeof User.findOne !== 'function') {
      console.error("User model is not properly defined:", User);
      return NextResponse.json({
        message: 'User model is not available',
        error: 'Database models not initialized properly'
      }, { status: 500 });
    }
    
    // Clear existing users if needed (uncomment if you want to reset users)
    // await User.deleteMany({});

    const results: ResultItem[] = [];
    let facultyUser: any = null;
    let studentUser: any = null;

    console.log("Creating users...");
    // Create users in sequence
    for (const userData of demoUsers) {
      console.log(`Processing user: ${userData.email}`);
      
      // Check if user already exists
      try {
        const existingUser = await User.findOne({ email: userData.email });
        
        if (existingUser) {
          console.log(`User ${userData.email} already exists`);
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
      } catch (findError) {
        console.error(`Error checking for existing user ${userData.email}:`, findError);
        results.push({ 
          message: `Error checking for existing user ${userData.email}: ${findError}`
        });
        continue;
      }

      try {
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

        console.log(`Saving new user: ${userData.email}`);
        await newUser.save();
        console.log(`User ${userData.email} created successfully`);

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
      } catch (createError) {
        console.error(`Error creating user ${userData.email}:`, createError);
        results.push({ 
          message: `Error creating user ${userData.email}: ${createError}`
        });
      }
    }

    // Update relationships if needed
    if (facultyUser && studentUser) {
      try {
        console.log("Updating student-faculty relationship");
        const updatedStudent = await User.findByIdAndUpdate(
          studentUser._id,
          { facultyId: facultyUser._id },
          { new: true }
        );
        
        if (updatedStudent) {
          console.log("Updated student with faculty reference");
          results.push({ message: 'Updated student with faculty reference' });
        }
      } catch (updateError) {
        console.error("Error updating student with faculty reference:", updateError);
        results.push({ message: `Error updating student: ${updateError}` });
      }
    }

    if (studentUser) {
      try {
        console.log("Finding parent user");
        const parentUser = await User.findOne({ role: 'parent' });
        if (parentUser && !parentUser.studentId) {
          console.log("Updating parent-student relationship");
          const updatedParent = await User.findByIdAndUpdate(
            parentUser._id, 
            { studentId: studentUser._id },
            { new: true }
          );
          
          if (updatedParent) {
            console.log("Updated parent with student reference");
            results.push({ message: 'Updated parent with student reference' });
          }
        }
      } catch (updateError) {
        console.error("Error updating parent with student reference:", updateError);
        results.push({ message: `Error updating parent: ${updateError}` });
      }
    }

    console.log("Seed process completed");
    return NextResponse.json({ 
      message: 'Demo users created successfully',
      results 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { 
        message: 'An error occurred during seeding', 
        error: String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace'
      },
      { status: 500 }
    );
  }
} 