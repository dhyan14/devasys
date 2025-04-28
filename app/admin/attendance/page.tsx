'use client';

import React, { useState } from 'react';

interface AttendanceRecord {
  id: string;
  studentName: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent';
  subject: string;
  class: string;
}

export default function AdminAttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState([
    { id: '1', studentName: 'John Doe', studentId: 'ST001', date: '2023-05-01', status: 'present', subject: 'Mathematics', class: 'Class 10A' },
    { id: '2', studentName: 'Jane Smith', studentId: 'ST002', date: '2023-05-01', status: 'absent', subject: 'Mathematics', class: 'Class 10A' },
    { id: '3', studentName: 'Alex Johnson', studentId: 'ST003', date: '2023-05-01', status: 'present', subject: 'Mathematics', class: 'Class 10A' },
    { id: '4', studentName: 'Sarah Williams', studentId: 'ST004', date: '2023-05-01', status: 'present', subject: 'Science', class: 'Class 9B' },
    { id: '5', studentName: 'Mike Brown', studentId: 'ST005', date: '2023-05-01', status: 'absent', subject: 'Science', class: 'Class 9B' },
  ] as AttendanceRecord[]);

  const [filters, setFilters] = useState({
    class: '',
    subject: '',
    date: '',
  });

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleStatusChange = (recordId: string, newStatus: 'present' | 'absent') => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.id === recordId ? { ...record, status: newStatus } : record
      )
    );
  };

  const filteredRecords = attendanceRecords.filter(record => {
    return (
      (filters.class === '' || record.class === filters.class) &&
      (filters.subject === '' || record.subject === filters.subject) &&
      (filters.date === '' || record.date === filters.date)
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Attendance Management</h1>
      
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              name="class"
              value={filters.class}
              onChange={handleFilterChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Classes</option>
              <option value="Class 10A">Class 10A</option>
              <option value="Class 9B">Class 9B</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{record.studentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{record.studentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{record.class}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{record.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{record.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleStatusChange(record.id, 'present')}
                        className={`px-2 py-1 text-xs rounded ${
                          record.status === 'present' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        Present
                      </button>
                      <button 
                        onClick={() => handleStatusChange(record.id, 'absent')}
                        className={`px-2 py-1 text-xs rounded ${
                          record.status === 'absent' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  No attendance records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 