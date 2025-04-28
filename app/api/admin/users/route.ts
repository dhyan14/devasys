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
    const { 
      name, 
      email, 
      password, 
      role, 
      profilePicture, 
      studentId, 
      facultyIds, 
      enrollmentNumber,
      department,
      subjectName 
    } = await req.json();

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

    // Role-specific validations
    if (role === 'parent' && !studentId) {
      return NextResponse.json(
        { error: 'Student ID is required for parent role.' },
        { status: 400 }
      );
    }

    if (facultyIds && !Array.isArray(facultyIds)) {
      return NextResponse.json(
        { error: 'Faculty IDs must be an array.' },
        { status: 400 }
      );
    }

    if (role === 'student') {
      // Check enrollment number
      if (!enrollmentNumber) {
        return NextResponse.json(
          { error: 'Enrollment number is required for student role.' },
          { status: 400 }
        );
      }

      // Check department
      if (!department) {
        return NextResponse.json(
          { error: 'Department is required for student role.' },
          { status: 400 }
        );
      }

      // Check if enrollment number is unique
      const existingEnrollment = await User.findOne({ enrollmentNumber });
      if (existingEnrollment) {
        return NextResponse.json(
          { error: 'User with this enrollment number already exists.' },
          { status: 400 }
        );
      }
    }

    if (role === 'faculty') {
      // Check department
      if (!department) {
        return NextResponse.json(
          { error: 'Department is required for faculty role.' },
          { status: 400 }
        );
      }

      // Check subject name
      if (!subjectName) {
        return NextResponse.json(
          { error: 'Subject name is required for faculty role.' },
          { status: 400 }
        );
      }
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user with appropriate fields based on role
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      profilePicture: profilePicture || '',
    };

    // Add role-specific fields
    if (role === 'parent') {
      Object.assign(userData, { studentId });
    } else if (role === 'student') {
      Object.assign(userData, { 
        facultyIds, 
        enrollmentNumber,
        department
      });
    } else if (role === 'faculty') {
      Object.assign(userData, {
        department,
        subjectName
      });
    }

    // Create and save the user
    const newUser = new User(userData);
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

// Delete a user
export async function DELETE(request: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();

    // Check if user is admin
    const session = await getSession();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admin can delete users.' },
        { status: 401 }
      );
    }

    // Get user ID from URL
    const url = new URL(request.url);
    const userId = url.searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required.' },
        { status: 400 }
      );
    }

    // Check if user is trying to delete themselves
    if (session.user.id === userId) {
      return NextResponse.json(
        { error: 'You cannot delete your own account.' },
        { status: 400 }
      );
    }

    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'User deleted successfully',
      userId
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user.' },
      { status: 500 }
    );
  }
}

// Update an existing user
export async function PUT(request: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();

    // Check if user is admin
    const session = await getSession();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admin can update users.' },
        { status: 401 }
      );
    }

    // Get user ID from URL
    const url = new URL(request.url);
    const userId = url.searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required.' },
        { status: 400 }
      );
    }

    // Parse the request body
    const updateData = await request.json();
    const { 
      name, 
      email, 
      role, 
      password, 
      profilePicture, 
      studentId, 
      facultyIds, 
      enrollmentNumber,
      department,
      subjectName 
    } = updateData;

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      );
    }

    // Update fields
    const updates: any = {};

    if (name) updates.name = name;
    if (email) {
      // Check if new email is already in use by another user
      if (email !== existingUser.email) {
        const emailExists = await User.findOne({ email, _id: { $ne: userId } });
        if (emailExists) {
          return NextResponse.json(
            { error: 'Email is already in use by another user.' },
            { status: 400 }
          );
        }
        updates.email = email;
      }
    }
    
    if (role) {
      // Check if role is valid
      if (!['admin', 'faculty', 'student', 'parent'].includes(role)) {
        return NextResponse.json(
          { error: 'Invalid role. Role must be admin, faculty, student, or parent.' },
          { status: 400 }
        );
      }
      updates.role = role;

      // Role-specific validation and updates
      if (role === 'student') {
        // If changing to student role, enrollment number is required
        if (!existingUser.enrollmentNumber && !enrollmentNumber) {
          return NextResponse.json(
            { error: 'Enrollment number is required for student role.' },
            { status: 400 }
          );
        }

        // If changing to student role, department is required
        if (!existingUser.department && !department) {
          return NextResponse.json(
            { error: 'Department is required for student role.' },
            { status: 400 }
          );
        }
      }

      if (role === 'faculty') {
        // If changing to faculty role, department is required
        if (!existingUser.department && !department) {
          return NextResponse.json(
            { error: 'Department is required for faculty role.' },
            { status: 400 }
          );
        }

        // If changing to faculty role, subject name is required
        if (!existingUser.subjectName && !subjectName) {
          return NextResponse.json(
            { error: 'Subject name is required for faculty role.' },
            { status: 400 }
          );
        }
      }

      if (role === 'parent' && !existingUser.studentId && !studentId) {
        return NextResponse.json(
          { error: 'Student ID is required for parent role.' },
          { status: 400 }
        );
      }
    }

    if (password) {
      updates.password = await hashPassword(password);
    }

    if (profilePicture !== undefined) {
      updates.profilePicture = profilePicture;
    }

    // Handle role-specific fields
    if (role === 'parent' || existingUser.role === 'parent') {
      if (studentId) {
        updates.studentId = studentId;
      }
    }

    if (role === 'student' || existingUser.role === 'student') {
      if (facultyIds) {
        if (!Array.isArray(facultyIds)) {
          return NextResponse.json(
            { error: 'Faculty IDs must be an array.' },
            { status: 400 }
          );
        }
        updates.facultyIds = facultyIds;
      }

      if (enrollmentNumber) {
        // Check if enrollment number is unique
        const existingEnrollment = await User.findOne({ 
          enrollmentNumber, 
          _id: { $ne: userId } 
        });
        
        if (existingEnrollment) {
          return NextResponse.json(
            { error: 'User with this enrollment number already exists.' },
            { status: 400 }
          );
        }
        updates.enrollmentNumber = enrollmentNumber;
      }

      if (department) {
        updates.department = department;
      }
    }

    if (role === 'faculty' || existingUser.role === 'faculty') {
      if (department) {
        updates.department = department;
      }
      
      if (subjectName) {
        updates.subjectName = subjectName;
      }
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).select('-password');

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user.' },
      { status: 500 }
    );
  }
} 