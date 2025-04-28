import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get the faculty session
    const session = await getSession();
    if (!session || session.role !== 'faculty') {
      return NextResponse.json(
        { message: 'Unauthorized - faculty access only' },
        { status: 401 }
      );
    }

    const facultyId = session.user.id;
    
    // Verify the faculty exists
    const faculty = await User.findById(facultyId);
    if (!faculty) {
      return NextResponse.json(
        { message: 'Faculty user not found' },
        { status: 404 }
      );
    }

    // Get all students who have selected this faculty as their advisor
    const students = await User.find({
      role: 'student',
      facultyIds: { $in: [facultyId] }
    }).select('_id name email enrollmentNumber department').lean();

    return NextResponse.json({ students });
  } catch (error) {
    console.error('Error fetching students for faculty:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching students' },
      { status: 500 }
    );
  }
} 