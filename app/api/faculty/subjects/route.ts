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
    
    // Get faculty user with subject information
    const faculty = await User.findById(facultyId).lean();
    if (!faculty) {
      return NextResponse.json(
        { message: 'Faculty user not found' },
        { status: 404 }
      );
    }

    // For now, we just return the faculty's main subject
    // In a real app, you would fetch all subjects assigned to this faculty from a Subjects collection
    const subjects = [
      {
        _id: '1',
        name: faculty.subjectName || 'Subject',
        code: `${faculty.subjectName?.substring(0, 4).toUpperCase() || 'SUBJ'}101`
      }
    ];

    return NextResponse.json({ subjects });
  } catch (error) {
    console.error('Error fetching subjects for faculty:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching subjects' },
      { status: 500 }
    );
  }
} 