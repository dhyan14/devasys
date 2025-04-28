'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar } from 'react-icons/fi';

export default function StudentAttendancePage() {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    // In a real application, fetch subjects from API
    setSubjects([
      { _id: '1', name: 'Mathematics', code: 'MATH101' },
      { _id: '2', name: 'Physics', code: 'PHYS101' },
      { _id: '3', name: 'Computer Science', code: 'CS101' },
    ]);
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    
    // Build query parameters
    const params = new URLSearchParams();
    if (fromDate) {
      params.append('fromDate', fromDate.toISOString());
    }
    if (toDate) {
      params.append('toDate', toDate.toISOString());
    }
    if (selectedSubject) {
      params.append('subjectId', selectedSubject);
    }

    try {
      // In a real application, fetch from API
      // const response = await fetch(`/api/attendance?${params.toString()}`);
      // const data = await response.json();
      // setAttendanceRecords(data);
      
      // Mock data for now
      setTimeout(() => {
        setAttendanceRecords([
          {
            _id: '1',
            date: new Date(),
            status: 'present',
            subjectId: { _id: '1', name: 'Mathematics', code: 'MATH101' },
            remarks: '',
          },
          {
            _id: '2',
            date: new Date(Date.now() - 86400000),
            status: 'absent',
            subjectId: { _id: '2', name: 'Physics', code: 'PHYS101' },
            remarks: 'Sick leave',
          },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Attendance Records</h1>
      
      {/* Filter Controls */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filter Records</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <div className="relative">
              <DatePicker
                selected={fromDate}
                onChange={setFromDate}
                dateFormat="yyyy-MM-dd"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                placeholderText="Select start date"
              />
              <FiCalendar className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>
            <div className="relative">
              <DatePicker
                selected={toDate}
                onChange={setToDate}
                dateFormat="yyyy-MM-dd"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                placeholderText="Select end date"
              />
              <FiCalendar className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <button
            onClick={fetchAttendance}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? 'Loading...' : 'Apply Filters'}
          </button>
        </div>
      </div>
      
      {/* Attendance Records */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Attendance Records</h2>
        
        {loading ? (
          <p className="text-center py-4">Loading attendance records...</p>
        ) : attendanceRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceRecords.map((record) => (
                  <tr key={record._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.subjectId.name} ({record.subjectId.code})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(record.status)}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.remarks || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-4 text-gray-500">No attendance records found. Try adjusting your filters.</p>
        )}
      </div>
    </div>
  );
} 