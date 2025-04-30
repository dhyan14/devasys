import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { getOrCreateSheet } from '../../../lib/googleAuth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Only allow faculty or admin to export
    if (session.user.role !== 'FACULTY' && session.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { courseId, month, year } = req.body;

    if (!courseId || month === undefined || year === undefined) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Get course details
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { faculty: { include: { user: true } } },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Calculate start and end dates for the selected month
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0); // Last day of the month

    // Get all students enrolled in this course (simplified)
    const students = await prisma.student.findMany({
      include: { user: true },
      where: { course: course.code },
    });

    // Get attendance records for the month
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        courseId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        student: {
          include: { user: true },
        },
      },
    });

    // Prepare data for Google Sheets
    // First row: Headers
    const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'long' });
    const sheetTitle = `${course.name} - ${monthName} ${year}`;
    
    // Create days array for the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    
    // Create headers row: Student Name, Student ID, Day 1, Day 2, ..., Present %, Total Present, Total Absent
    const headers = [
      'Student Name', 
      'Enrollment No.',
      ...daysArray.map(day => `Day ${day}`),
      'Present %',
      'Total Present',
      'Total Absent',
      'Total On Leave'
    ];

    // Create rows for each student
    const rows = students.map(student => {
      const studentAttendance = new Array(daysInMonth).fill('');
      
      // Fill in attendance data
      attendanceRecords
        .filter(record => record.studentId === student.id)
        .forEach(record => {
          const day = record.date.getDate() - 1; // 0-indexed
          studentAttendance[day] = record.status;
        });
      
      // Calculate totals
      const totalPresent = studentAttendance.filter(status => status === 'PRESENT').length;
      const totalAbsent = studentAttendance.filter(status => status === 'ABSENT').length;
      const totalOnLeave = studentAttendance.filter(status => status === 'ON_LEAVE').length;
      const attendedDays = totalPresent + totalOnLeave;
      const presentPercentage = Math.round((attendedDays / daysInMonth) * 100);
      
      return [
        student.user.name,
        student.enrollmentNo,
        ...studentAttendance,
        `${presentPercentage}%`,
        totalPresent.toString(),
        totalAbsent.toString(),
        totalOnLeave.toString()
      ];
    });

    // Get or create a Google Sheet
    const { spreadsheetId, sheets } = await getOrCreateSheet(sheetTitle);

    // Create a new sheet within the spreadsheet or clear existing one
    let sheetId = 0;
    try {
      // Try to add a new sheet
      const addSheetResponse = await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetTitle,
                },
              },
            },
          ],
        },
      });
      sheetId = addSheetResponse.data.replies[0].addSheet.properties.sheetId;
    } catch (error) {
      // Sheet might already exist, find it
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId,
      });
      
      const existingSheet = spreadsheet.data.sheets.find(
        s => s.properties.title === sheetTitle
      );
      
      if (existingSheet) {
        sheetId = existingSheet.properties.sheetId;
        
        // Clear the existing content
        await sheets.spreadsheets.values.clear({
          spreadsheetId,
          range: sheetTitle,
        });
      } else {
        throw new Error('Failed to create or find sheet');
      }
    }

    // Write data to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: sheetTitle,
      valueInputOption: 'RAW',
      requestBody: {
        values: [headers, ...rows],
      },
    });

    // Format the sheet
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          // Make header row bold
          {
            repeatCell: {
              range: {
                sheetId,
                startRowIndex: 0,
                endRowIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  textFormat: {
                    bold: true,
                  },
                  backgroundColor: {
                    red: 0.9,
                    green: 0.9,
                    blue: 0.9,
                  },
                },
              },
              fields: 'userEnteredFormat(textFormat,backgroundColor)',
            },
          },
          // Freeze the header row
          {
            updateSheetProperties: {
              properties: {
                sheetId,
                gridProperties: {
                  frozenRowCount: 1,
                  frozenColumnCount: 2,
                },
              },
              fields: 'gridProperties.frozenRowCount,gridProperties.frozenColumnCount',
            },
          },
        ],
      },
    });

    // Get the sheet URL to return to the client
    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    return res.status(200).json({ 
      success: true, 
      message: 'Attendance data exported successfully',
      url: spreadsheetUrl
    });

  } catch (error) {
    console.error('Export to Google Sheets error:', error);
    return res.status(500).json({ 
      message: 'Failed to export attendance data', 
      error: error.message 
    });
  }
} 