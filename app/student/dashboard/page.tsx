'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiUser, FiCalendar, FiBook, FiClock } from 'react-icons/fi';

export default function StudentDashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

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
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
      
      {/* Student Info Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="bg-primary p-3 rounded-full">
            <FiUser className="h-8 w-8 text-white" />
          </div>
          <div className="mt-4 md:mt-0 md:ml-4">
            <h2 className="text-xl font-bold text-gray-900">John Doe</h2>
            <p className="text-sm text-gray-500">Class 10A • Roll No: 101</p>
            <p className="text-sm text-gray-500">john.doe@example.com</p>
          </div>
          <div className="mt-4 md:mt-0 md:ml-auto">
            <Link 
              href="/student/attendance" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none"
            >
              View Attendance
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
              <p className="text-2xl font-bold text-gray-900">85%</p>
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
      
      {/* Today's Schedule & Attendance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Schedule */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Today's Schedule</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
                  <FiBook className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Mathematics</h3>
                  <p className="text-sm text-gray-500">MATH-101</p>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    <span>9:00 AM - 10:30 AM</span>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <span className="inline-block h-4 w-4 rounded-full bg-gray-100 mr-1.5"></span>
                    <span>Room 203</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-2">
                  <FiBook className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Physics</h3>
                  <p className="text-sm text-gray-500">PHY-101</p>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    <span>11:00 AM - 12:30 PM</span>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <span className="inline-block h-4 w-4 rounded-full bg-gray-100 mr-1.5"></span>
                    <span>Room 105</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-purple-100 rounded-md p-2">
                  <FiBook className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Chemistry</h3>
                  <p className="text-sm text-gray-500">CHEM-101</p>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    <span>2:00 PM - 3:30 PM</span>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <span className="inline-block h-4 w-4 rounded-full bg-gray-100 mr-1.5"></span>
                    <span>Room 302</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Attendance Summary */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Attendance Summary</h2>
            <Link href="/student/attendance" className="text-primary text-sm hover:underline">
              View All
            </Link>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">This Month</h3>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                      85% Present
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-green-600">
                      17/20 Days
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                  <div style={{ width: "85%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Subject-wise Attendance</h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mathematics</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">90%</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Physics</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">85%</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Chemistry</span>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">75%</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Biology</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">88%</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">English</span>
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">70%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 