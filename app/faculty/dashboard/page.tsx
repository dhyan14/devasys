'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiUser, FiCalendar, FiUsers, FiClock } from 'react-icons/fi';

export default function FacultyDashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Faculty Dashboard</h1>
      
      {/* Welcome Card */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center">
          <div className="bg-primary rounded-full p-4">
            <FiUser className="text-white text-xl" />
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-semibold">Welcome, Professor Smith</h2>
            <p className="text-gray-600">Mathematics Department</p>
          </div>
          <div className="ml-auto">
            <Link
              href="/faculty/attendance"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Take Attendance
            </Link>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <FiUsers className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Classes Today</h3>
              <p className="text-2xl font-semibold text-gray-900">4</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <FiUsers className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
              <p className="text-2xl font-semibold text-gray-900">125</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <FiCalendar className="text-yellow-600 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Leave Requests</h3>
              <p className="text-2xl font-semibold text-gray-900">3</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <FiClock className="text-purple-600 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Teaching Hours</h3>
              <p className="text-2xl font-semibold text-gray-900">18h/week</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Today's Schedule */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Today's Schedule</h2>
        </div>
        <div className="p-6">
          <ul className="divide-y divide-gray-200">
            <li className="py-4 first:pt-0 last:pb-0">
              <div className="flex space-x-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Mathematics 101</h3>
                    <p className="text-sm text-gray-500">9:00 AM - 10:30 AM</p>
                  </div>
                  <p className="text-sm text-gray-500">Class 10A | Room 203</p>
                </div>
              </div>
            </li>
            <li className="py-4">
              <div className="flex space-x-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Advanced Calculus</h3>
                    <p className="text-sm text-gray-500">11:00 AM - 12:30 PM</p>
                  </div>
                  <p className="text-sm text-gray-500">Class 12B | Room 105</p>
                </div>
              </div>
            </li>
            <li className="py-4">
              <div className="flex space-x-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Linear Algebra</h3>
                    <p className="text-sm text-gray-500">2:00 PM - 3:30 PM</p>
                  </div>
                  <p className="text-sm text-gray-500">Class 11A | Room 302</p>
                </div>
              </div>
            </li>
            <li className="py-4">
              <div className="flex space-x-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Statistics</h3>
                    <p className="text-sm text-gray-500">4:00 PM - 5:30 PM</p>
                  </div>
                  <p className="text-sm text-gray-500">Class 12A | Room 201</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        <div className="p-6">
          <ul className="divide-y divide-gray-200">
            <li className="py-4 first:pt-0 last:pb-0">
              <div className="flex space-x-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Attendance Recorded</h3>
                    <p className="text-sm text-gray-500">Today, 10:30 AM</p>
                  </div>
                  <p className="text-sm text-gray-500">Mathematics 101 - Class 10A</p>
                </div>
              </div>
            </li>
            <li className="py-4">
              <div className="flex space-x-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Leave Approved</h3>
                    <p className="text-sm text-gray-500">Yesterday, 3:45 PM</p>
                  </div>
                  <p className="text-sm text-gray-500">Student: John Doe - Class 10A</p>
                </div>
              </div>
            </li>
            <li className="py-4">
              <div className="flex space-x-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Attendance Recorded</h3>
                    <p className="text-sm text-gray-500">Yesterday, 12:30 PM</p>
                  </div>
                  <p className="text-sm text-gray-500">Advanced Calculus - Class 12B</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 