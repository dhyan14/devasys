'use client';

import React, { useState, useEffect } from 'react';

// Simple interface for attendance records
interface AttendanceRecord {
  _id: string;
  date: Date;
  status: string;
  subject: string;
  remarks?: string;
}

export default function StudentAttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState([] as AttendanceRecord[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setAttendanceRecords([
        {
          _id: '1',
          date: new Date(),
          status: 'present',
          subject: 'Mathematics',
          remarks: ''
        },
        {
          _id: '2',
          date: new Date(Date.now() - 86400000),
          status: 'absent',
          subject: 'Physics',
          remarks: 'Sick leave'
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Attendance Records</h1>
      
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-medium mb-4">Attendance History</h2>
        
        {loading ? (
          <p>Loading attendance records...</p>
        ) : attendanceRecords.length > 0 ? (
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left">Date</th>
                <th className="text-left">Subject</th>
                <th className="text-left">Status</th>
                <th className="text-left">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record) => (
                <tr key={record._id}>
                  <td className="py-2">{record.date.toLocaleDateString()}</td>
                  <td className="py-2">{record.subject}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      record.status === 'present' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="py-2">{record.remarks || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No attendance records found.</p>
        )}
      </div>
    </div>
  );
} 