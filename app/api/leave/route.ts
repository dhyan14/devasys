import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Leave } from '@/models/Leave';
import { getUserFromRequest } from '@/lib/auth';

// Get leave applications
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

    // Status filtering
    const status = searchParams.get('status');
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }

    // Role-based access control
    if (role === 'student') {
      // Students can only view their own leave applications
      query.studentId = user._id;
    } else if (role === 'parent') {
      // Parents can only view their child's leave applications
      query.studentId = user.studentId;
    } else if (role === 'faculty') {
      // Faculty can view leave applications assigned to them
      query.facultyId = user._id;
    }
    // Admin can view all records

    // Execute the query with population
    const leaveApplications = await Leave.find(query)
      .populate('studentId', 'name email')
      .populate('facultyId', 'name email')
      .populate('appliedBy', 'name email role')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(leaveApplications);
  } catch (error) {
    console.error('Get leave applications error:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching leave applications' },
      { status: 500 }
    );
  }
}

// Create leave application
export async function POST(request: NextRequest) {
  try {
    const session = await getUserFromRequest(request);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { user, role } = session;

    // Only students and parents can create leave applications
    if (role !== 'student' && role !== 'parent') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const data = await request.json();
    
    // Validate input
    if (!data.fromDate || !data.toDate || !data.reason || !data.facultyId) {
      return NextResponse.json(
        { message: 'From date, to date, reason, and faculty are required' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Create leave application
    const leaveApplication = new Leave({
      studentId: role === 'student' ? user._id : user.studentId,
      facultyId: data.facultyId,
      fromDate: new Date(data.fromDate),
      toDate: new Date(data.toDate),
      reason: data.reason,
      appliedBy: user._id,
      status: 'pending',
      remarks: data.remarks || '',
    });

    await leaveApplication.save();

    return NextResponse.json(
      { message: 'Leave application submitted successfully', id: leaveApplication._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create leave application error:', error);
    return NextResponse.json(
      { message: 'An error occurred while submitting leave application' },
      { status: 500 }
    );
  }
}

// Update leave application (approve/reject)
export async function PUT(request: NextRequest) {
  try {
    const session = await getUserFromRequest(request);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { user, role } = session;

    // Only faculty and admin can update leave applications
    if (role !== 'faculty' && role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const data = await request.json();
    
    // Validate input
    if (!data.id || !data.status || !['approved', 'rejected'].includes(data.status)) {
      return NextResponse.json(
        { message: 'Leave ID and valid status (approved/rejected) are required' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find the leave application
    const leaveApplication = await Leave.findById(data.id);
    
    if (!leaveApplication) {
      return NextResponse.json(
        { message: 'Leave application not found' },
        { status: 404 }
      );
    }

    // Check if faculty has permission to update this leave
    if (role === 'faculty' && leaveApplication.facultyId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { message: 'Unauthorized to update this leave application' },
        { status: 403 }
      );
    }

    // Update leave application
    leaveApplication.status = data.status;
    leaveApplication.remarks = data.remarks || leaveApplication.remarks;
    
    await leaveApplication.save();

    return NextResponse.json({ message: 'Leave application updated successfully' });
  } catch (error) {
    console.error('Update leave application error:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating leave application' },
      { status: 500 }
    );
  }
} 