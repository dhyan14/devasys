'use client';

import { useState, useEffect } from 'react';
import { FiCalendar, FiFilter, FiUser } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Link from 'next/link';

// Mocked data for initial development
// Replace with actual API calls in production
const SUBJECTS = [
  { _id: '1', name: 'Mathematics', code: 'MATH101' },
  { _id: '2', name: 'Physics', code: 'PHYS101' },
  { _id: '3', name: 'Computer Science', code: 'CS101' },
];

const ATTENDANCE_DATA = [
  { 
    _id: '1', 
    date: new Date(2023, 5, 1), 
    subjectId: { _id: '1', name: 'Mathematics', code: 'MATH101' }, 
    status: 'present' 
  },
  { 
    _id: '2', 
    date: new Date(2023, 5, 2), 
    subjectId: { _id: '1', name: 'Mathematics', code: 'MATH101' }, 
    status: 'present' 
  },
  { 
    _id: '3', 
    date: new Date(2023, 5, 3), 
    subjectId: { _id: '2', name: 'Physics', code: 'PHYS101' }, 
    status: 'absent' 
  },
  { 
    _id: '4', 
    date: new Date(2023, 5, 4), 
    subjectId: { _id: '3', name: 'Computer Science', code: 'CS101' }, 
    status: 'leave' 
  },
  { 
    _id: '5', 
    date: new Date(2023, 5, 5), 
    subjectId: { _id: '3', name: 'Computer Science', code: 'CS101' }, 
    status: 'present' 
  }
];

// Mock student data
const STUDENT = {
  _id: '123',
  name: 'John Doe',
  email: 'john@example.com',
  class: '10th Grade',
  rollNumber: 'A12345'
};

export default function ParentAttendancePage() {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    leave: 0,
    total: 0,
    percentage: 0
  });

  // Load attendance data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAttendanceData(ATTENDANCE_DATA);
      setFilteredData(ATTENDANCE_DATA);
      setLoading(false);
    }, 1000);
  }, []);

  // Apply filters
  useEffect(() => {
    if (attendanceData.length === 0) return;

    let filtered = [...attendanceData];

    // Filter by date range
    if (fromDate) {
      filtered = filtered.filter(item => new Date(item.date) >= fromDate);
    }
    
    if (toDate) {
      const endDate = new Date(toDate);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(item => new Date(item.date) <= endDate);
    }

    // Filter by subject
    if (selectedSubject) {
      filtered = filtered.filter(item => item.subjectId._id === selectedSubject);
    }

    setFilteredData(filtered);

    // Calculate statistics
    const total = filtered.length;
    const present = filtered.filter(item => item.status === 'present').length;
    const absent = filtered.filter(item => item.status === 'absent').length;
    const leave = filtered.filter(item => item.status === 'leave').length;

    setStats({
      present,
      absent,
      leave,
      total,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0
    });
  }, [fromDate, toDate, selectedSubject, attendanceData]);

  const getStatusClass = (status: string) => {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Student Attendance</h1>
      
      {/* Student Info Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center">
          <div className="bg-primary p-3 rounded-full">
            <FiUser className="h-8 w-8 text-white" />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold text-gray-900">{STUDENT.name}</h2>
            <p className="text-sm text-gray-500">{STUDENT.class} • Roll No: {STUDENT.rollNumber}</p>
            <p className="text-sm text-gray-500">{STUDENT.email}</p>
          </div>
          <div className="ml-auto">
            <Link 
              href="/parent/leaves/apply" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Apply for Leave
            </Link>
          </div>
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm font-medium">Present</h2>
              <p className="text-2xl font-bold text-gray-900">{stats.present}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm font-medium">Absent</h2>
              <p className="text-2xl font-bold text-gray-900">{stats.absent}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm font-medium">Leave</h2>
              <p className="text-2xl font-bold text-gray-900">{stats.leave}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm font-medium">Attendance</h2>
              <p className="text-2xl font-bold text-gray-900">{stats.percentage}%</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <FiFilter className="mr-2" />
          Filters
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <div className="relative">
              <DatePicker
                selected={fromDate}
                onChange={setFromDate}
                selectsStart
                startDate={fromDate}
                endDate={toDate}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                placeholderText="Select start date"
                dateFormat="MMMM d, yyyy"
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
                selectsEnd
                startDate={fromDate}
                endDate={toDate}
                minDate={fromDate}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                placeholderText="Select end date"
                dateFormat="MMMM d, yyyy"
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
              {SUBJECTS.map(subject => (
                <option key={subject._id} value={subject._id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Attendance Records */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Attendance Records</h2>
        </div>
        
        {loading ? (
          <div className="px-6 py-12 text-center">
            <p>Loading attendance records...</p>
          </div>
        ) : filteredData.length > 0 ? (
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((record) => (
                  <tr key={record._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.subjectId.name}</div>
                      <div className="text-sm text-gray-500">{record.subjectId.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(record.status)}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No attendance records found with the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
} 