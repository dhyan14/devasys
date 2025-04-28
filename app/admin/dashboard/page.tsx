'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiUser, FiUsers, FiCalendar, FiBook, FiSettings, FiPlus } from 'react-icons/fi';
import dynamic from 'next/dynamic';

// Dynamically import the AddUserForm component to avoid build issues
const AddUserForm = dynamic(() => import('../../../components/admin/AddUserForm'), {
  ssr: false,
});

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    facultyMembers: 0,
    totalCourses: 36, // Mocked data for now
    activeDepartments: 12, // Mocked data for now
  });

  // Fetch users and calculate stats
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        
        // Calculate stats
        const students = data.users.filter((user: any) => user.role === 'student');
        const faculty = data.users.filter((user: any) => user.role === 'faculty');
        
        setDashboardStats({
          totalStudents: students.length,
          facultyMembers: faculty.length,
          totalCourses: 36, // Mocked data for now
          activeDepartments: 12, // Mocked data for now
        });
      } else {
        console.error('Failed to fetch users:', response.status);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    // Simulate API loading
    setTimeout(async () => {
      await fetchUsers();
      setLoading(false);
    }, 800);
  }, []);

  const handleAddUserSuccess = () => {
    fetchUsers();
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
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Welcome Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="bg-primary p-3 rounded-full">
            <FiSettings className="h-8 w-8 text-white" />
          </div>
          <div className="mt-4 md:mt-0 md:ml-4">
            <h2 className="text-xl font-bold text-gray-900">Welcome, Administrator</h2>
            <p className="text-sm text-gray-500">University Attendance System</p>
          </div>
          <div className="mt-4 md:mt-0 md:ml-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Link 
              href="/admin/faculty" 
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none"
            >
              Manage Faculty
            </Link>
            <Link 
              href="/admin/students" 
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Manage Students
            </Link>
          </div>
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <FiUsers className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm font-medium">Total Students</h2>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalStudents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <FiUser className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm font-medium">Faculty Members</h2>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.facultyMembers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <FiBook className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm font-medium">Total Courses</h2>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalCourses}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <FiCalendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm font-medium">Active Departments</h2>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeDepartments}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* User Management & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Management */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">User Management</h2>
            <div className="flex items-center">
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center text-primary hover:text-primary-dark mr-4"
              >
                <FiPlus className="mr-1" />
                <span>Add User</span>
              </button>
              <Link href="/admin/users" className="text-primary text-sm hover:underline">
                View All
              </Link>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.slice(0, 5).map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'faculty'
                          ? 'bg-blue-100 text-blue-800'
                          : user.role === 'student'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Recent Activities</h2>
          </div>
          
          <div className="p-6">
            <ul className="divide-y divide-gray-200">
              <li className="py-4 first:pt-0 last:pb-0">
                <div className="flex space-x-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">New Faculty Added</h3>
                      <p className="text-sm text-gray-500">Today, 11:30 AM</p>
                    </div>
                    <p className="text-sm text-gray-500">Dr. Jennifer Adams - Computer Science Department</p>
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex space-x-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Course Schedule Updated</h3>
                      <p className="text-sm text-gray-500">Yesterday, 2:15 PM</p>
                    </div>
                    <p className="text-sm text-gray-500">Fall Semester 2023 - Engineering Department</p>
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex space-x-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">System Maintenance</h3>
                      <p className="text-sm text-gray-500">Jun 10, 9:00 AM</p>
                    </div>
                    <p className="text-sm text-gray-500">Database optimization and system updates completed</p>
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex space-x-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">New Student Enrollment</h3>
                      <p className="text-sm text-gray-500">Jun 8, 10:45 AM</p>
                    </div>
                    <p className="text-sm text-gray-500">35 new students enrolled in Computer Science program</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Add User Modal */}
      {showAddForm && (
        <AddUserForm 
          onClose={() => setShowAddForm(false)}
          onSuccess={handleAddUserSuccess}
        />
      )}
    </div>
  );
} 