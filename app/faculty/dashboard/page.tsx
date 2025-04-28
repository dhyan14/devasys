'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiUser, FiCalendar, FiUsers, FiClock, FiFileText } from 'react-icons/fi';

export default function FacultyDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [facultyData, setFacultyData] = useState({
    name: 'Professor',
    department: 'Department',
    subjectName: 'Subject',
    studentCount: 0,
    pendingLeaveRequests: 0
  });

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        // Get current user/session info
        const sessionRes = await fetch('/api/auth/session');
        if (!sessionRes.ok) throw new Error('Failed to fetch session');
        const sessionData = await sessionRes.json();

        if (!sessionData.user) {
          setLoading(false);
          return;
        }

        // Fetch faculty details including assigned students
        const facultyRes = await fetch(`/api/faculty/dashboard`);
        if (facultyRes.ok) {
          const data = await facultyRes.json();
          setFacultyData({
            name: data.name || 'Professor',
            department: data.department || 'Department',
            subjectName: data.subjectName || 'Subject',
            studentCount: data.studentCount || 0,
            pendingLeaveRequests: data.pendingLeaveRequests || 0
          });
        }
      } catch (error) {
        console.error('Error fetching faculty data:', error);
        // Use fallback data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyData();
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
            <h2 className="text-lg font-semibold">Welcome, {facultyData.name}</h2>
            <p className="text-gray-600">{facultyData.department} - {facultyData.subjectName}</p>
          </div>
          <div className="ml-auto flex space-x-4">
            <Link
              href="/faculty/leave-requests"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              View Leave Requests
            </Link>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <FiFileText className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending Leave Requests</h3>
              <p className="text-2xl font-semibold text-gray-900">{facultyData.pendingLeaveRequests}</p>
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
              <p className="text-2xl font-semibold text-gray-900">{facultyData.studentCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 