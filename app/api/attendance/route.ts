import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Attendance } from '@/models/Attendance';
import { getUserFromRequest } from '@/lib/auth';

// Get attendance records (with filtering)
export async function GET(request: NextRequest) {
  try {
    const session = await getUserFromRequest(request);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { user, role } = session;
    const searchParams = request.nextUrl.searchParams;
    
    // Connect to the database
    await connectToDatabase();

    // Build query based on role and parameters
    let query: any = {};

    // Date filtering
    const date = searchParams.get('date');
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      query.date = { $gte: startDate, $lte: endDate };
    }

    // Subject filtering
    const subjectId = searchParams.get('subjectId');
    if (subjectId) {
      query.subjectId = subjectId;
    }

    // Role-based access control
    if (role === 'student') {
      // Students can only view their own attendance
      query.studentId = user._id;
    } else if (role === 'parent') {
      // Parents can only view their child's attendance
      query.studentId = user.studentId;
    } else if (role === 'faculty') {
      // Faculty can view attendance they've created
      if (!subjectId) {
        query.createdBy = user._id;
      }
    }
    // Admin can view all records

    // Execute the query with population
    const attendanceRecords = await Attendance.find(query)
      .populate('studentId', 'name email')
      .populate('subjectId', 'name code')
      .populate('createdBy', 'name')
      .sort({ date: -1 })
      .lean();

    return NextResponse.json(attendanceRecords);
  } catch (error) {
    console.error('Get attendance error:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching attendance records' },
      { status: 500 }
    );
  }
}

// Create attendance record(s)
export async function POST(request: NextRequest) {
  try {
    const session = await getUserFromRequest(request);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { user, role } = session;

    // Only faculty and admin can create attendance records
    if (role !== 'faculty' && role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const data = await request.json();
    
    // Validate input
    if (!data.date || !data.subjectId || !data.records || !Array.isArray(data.records)) {
      return NextResponse.json(
        { message: 'Date, subject, and attendance records are required' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Process attendance records
    const date = new Date(data.date);
    const subjectId = data.subjectId;
    const records = data.records;

    // Prepare bulk operation
    const attendanceRecords = records.map((record: any) => ({
      date,
      studentId: record.studentId,
      subjectId,
      status: record.status,
      remarks: record.remarks || '',
      createdBy: user._id,
    }));

    // Use bulk operation for better performance
    await Attendance.bulkWrite(
      attendanceRecords.map((record: any) => ({
        updateOne: {
          filter: {
            date: { $gte: new Date(date.setHours(0, 0, 0, 0)), $lte: new Date(date.setHours(23, 59, 59, 999)) },
            studentId: record.studentId,
            subjectId: record.subjectId,
          },
          update: { $set: record },
          upsert: true,
        },
      }))
    );

    return NextResponse.json({ message: 'Attendance records saved successfully' }, { status: 201 });
  } catch (error) {
    console.error('Create attendance error:', error);
    return NextResponse.json(
      { message: 'An error occurred while saving attendance records' },
      { status: 500 }
    );
  }
} 