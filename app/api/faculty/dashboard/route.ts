import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Get session to verify user is faculty and get their info
    const session = await getSession();

    if (!session || session.role !== 'faculty') {
      return NextResponse.json(
        { message: 'Unauthorized - Faculty access only' },
        { status: 401 }
      );
    }

    // Get faculty user from database with full profile data
    const facultyId = session.user.id;
    const faculty = await User.findById(facultyId).lean();

    if (!faculty) {
      return NextResponse.json(
        { message: 'Faculty not found' },
        { status: 404 }
      );
    }

    // Get count of students who have this faculty as their advisor
    const studentCount = await User.countDocuments({
      role: 'student',
      facultyIds: { $in: [facultyId] }
    });

    // In a real application, you would fetch pending leave requests
    // For now, we'll return a random number between 0 and 5
    const pendingLeaveRequests = Math.floor(Math.random() * 6);

    // Combine all data for the response
    const dashboardData = {
      name: faculty.name,
      department: faculty.department,
      subjectName: faculty.subjectName,
      studentCount,
      pendingLeaveRequests
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching faculty dashboard data:', error);
    return NextResponse.json(
      { message: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 