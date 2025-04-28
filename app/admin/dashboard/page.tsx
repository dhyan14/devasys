'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiUsers, FiUserPlus, FiUserCheck, FiUserX, FiBook, FiCalendar } from 'react-icons/fi';

// Mock data for initial development
// Replace with actual API calls in production
const STATS = {
  faculty: 15,
  students: 280,
  parents: 240,
  courses: 24,
  subjects: 48,
  admins: 3
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-primary-dark p-3 rounded-full">
              <FiUsers className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm font-medium">Total Faculty</h2>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.faculty}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-secondary p-3 rounded-full">
              <FiUserCheck className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm font-medium">Total Students</h2>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.students}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-600 p-3 rounded-full">
              <FiUserX className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm font-medium">Total Parents</h2>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.parents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-600 p-3 rounded-full">
              <FiBook className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm font-medium">Courses</h2>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.courses}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-teal-600 p-3 rounded-full">
              <FiCalendar className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm font-medium">Subjects</h2>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.subjects}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-gray-800 p-3 rounded-full">
              <FiUserPlus className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm font-medium">Admins</h2>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.admins}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link 
          href="/admin/faculty/add" 
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 flex items-center"
        >
          <div className="bg-primary p-3 rounded-full">
            <FiUserPlus className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="font-medium text-gray-900">Add New Faculty</h3>
            <p className="text-sm text-gray-500">Create faculty account</p>
          </div>
        </Link>
        
        <Link 
          href="/admin/students/add" 
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 flex items-center"
        >
          <div className="bg-secondary p-3 rounded-full">
            <FiUserPlus className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="font-medium text-gray-900">Add New Student</h3>
            <p className="text-sm text-gray-500">Create student account</p>
          </div>
        </Link>
        
        <Link 
          href="/admin/parents/add" 
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 flex items-center"
        >
          <div className="bg-purple-600 p-3 rounded-full">
            <FiUserPlus className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="font-medium text-gray-900">Add New Parent</h3>
            <p className="text-sm text-gray-500">Create parent account</p>
          </div>
        </Link>
        
        <Link 
          href="/admin/faculty" 
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 flex items-center"
        >
          <div className="bg-blue-600 p-3 rounded-full">
            <FiUsers className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="font-medium text-gray-900">Manage Faculty</h3>
            <p className="text-sm text-gray-500">View and edit faculty</p>
          </div>
        </Link>
        
        <Link 
          href="/admin/students" 
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 flex items-center"
        >
          <div className="bg-green-600 p-3 rounded-full">
            <FiUsers className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="font-medium text-gray-900">Manage Students</h3>
            <p className="text-sm text-gray-500">View and edit students</p>
          </div>
        </Link>
        
        <Link 
          href="/admin/parents" 
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 flex items-center"
        >
          <div className="bg-yellow-600 p-3 rounded-full">
            <FiUsers className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="font-medium text-gray-900">Manage Parents</h3>
            <p className="text-sm text-gray-500">View and edit parents</p>
          </div>
        </Link>
      </div>
      
      {/* System Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">System Name</p>
            <p className="font-medium">University Attendance System</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Version</p>
            <p className="font-medium">1.0.0</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Update</p>
            <p className="font-medium">{new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Database</p>
            <p className="font-medium">MongoDB</p>
          </div>
        </div>
      </div>
    </div>
  );
} 