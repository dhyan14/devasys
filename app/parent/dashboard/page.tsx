'use client';

// Ensure this is a client component to avoid server component serialization issues
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiUser, FiCalendar, FiBook, FiClock } from 'react-icons/fi';

// Mock student data
const STUDENT = {
  _id: '1',
  name: 'John Doe',
  class: 'Class 10A',
  rollNumber: '101',
  email: 'john.doe@example.com',
  attendancePercentage: 85,
};

// Mock recent attendance
const RECENT_ATTENDANCE = [
  { _id: '1', date: '2023-05-10', status: 'present', subject: { name: 'Mathematics', code: 'MATH-101' } },
  { _id: '2', date: '2023-05-09', status: 'present', subject: { name: 'Physics', code: 'PHY-101' } },
  { _id: '3', date: '2023-05-08', status: 'absent', subject: { name: 'Chemistry', code: 'CHEM-101' } },
  { _id: '4', date: '2023-05-07', status: 'present', subject: { name: 'English', code: 'ENG-101' } },
];

// Mock upcoming classes
const UPCOMING_CLASSES = [
  { _id: '1', date: '2023-05-11', time: '09:00 AM - 10:00 AM', subject: { name: 'Mathematics', code: 'MATH-101' } },
  { _id: '2', date: '2023-05-11', time: '11:00 AM - 12:00 PM', subject: { name: 'Physics', code: 'PHY-101' } },
  { _id: '3', date: '2023-05-12', time: '09:00 AM - 10:00 AM', subject: { name: 'Chemistry', code: 'CHEM-101' } },
];

export default function ParentDashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Parent Dashboard</h1>
      
      {/* Student Info Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="bg-primary p-3 rounded-full">
            <FiUser className="h-8 w-8 text-white" />
          </div>
          <div className="mt-4 md:mt-0 md:ml-4">
            <h2 className="text-xl font-bold text-gray-900">{STUDENT.name}</h2>
            <p className="text-sm text-gray-500">{STUDENT.class} • Roll No: {STUDENT.rollNumber}</p>
            <p className="text-sm text-gray-500">{STUDENT.email}</p>
          </div>
          <div className="mt-4 md:mt-0 md:ml-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Link 
              href="/parent/attendance" 
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none"
            >
              View Attendance
            </Link>
            <Link 
              href="/parent/leaves/apply" 
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Apply for Leave
            </Link>
          </div>
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <FiUser className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm font-medium">Attendance</h2>
              <p className="text-2xl font-bold text-gray-900">{STUDENT.attendancePercentage}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <FiBook className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm font-medium">Subjects</h2>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <FiCalendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm font-medium">Classes Today</h2>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <FiClock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm font-medium">Study Hours</h2>
              <p className="text-2xl font-bold text-gray-900">24h/week</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Attendance & Upcoming Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Attendance */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Recent Attendance</h2>
            <Link href="/parent/attendance" className="text-primary text-sm hover:underline">
              View All
            </Link>
          </div>
          
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
                {RECENT_ATTENDANCE.map((record) => (
                  <tr key={record._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.subject.name}</div>
                      <div className="text-sm text-gray-500">{record.subject.code}</div>
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
        </div>
        
        {/* Upcoming Classes */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Upcoming Classes</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {UPCOMING_CLASSES.map((classItem) => (
              <div key={classItem._id} className="px-6 py-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
                    <FiBook className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">{classItem.subject.name}</h3>
                    <p className="text-sm text-gray-500">{classItem.subject.code}</p>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <FiCalendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>{new Date(classItem.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>{classItem.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 