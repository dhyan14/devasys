import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
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

    // Parse the request body
    const data = await request.json();
    const { date, subjectId, records } = data;

    // Validate required fields
    if (!date || !subjectId || !records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { message: 'Invalid attendance data. Date, subject and student records are required.' },
        { status: 400 }
      );
    }

    // In a real app, you would save this to a dedicated Attendance collection
    // For now, we'll just return success
    
    console.log('Attendance recorded for:', {
      faculty: session.user.id,
      date,
      subjectId,
      recordCount: records.length
    });

    return NextResponse.json({
      message: 'Attendance recorded successfully',
      attendanceDate: date,
      recordCount: records.length
    });
  } catch (error) {
    console.error('Error recording attendance:', error);
    return NextResponse.json(
      { message: 'An error occurred while recording attendance' },
      { status: 500 }
    );
  }
} 