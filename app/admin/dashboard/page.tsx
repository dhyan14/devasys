'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiUser, FiUsers, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import dynamic from 'next/dynamic';

// Dynamically import components
const AddUserForm = dynamic(() => import('../../../components/admin/AddUserForm'), {
  ssr: false,
});

const EditUserForm = dynamic(() => import('../../../components/admin/EditUserForm'), {
  ssr: false, 
});

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    facultyMembers: 0,
  });

  // Fetch users and calculate stats
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        
        // Calculate stats from actual data
        const students = data.users.filter((user: any) => user.role === 'student');
        const faculty = data.users.filter((user: any) => user.role === 'faculty');
        
        setDashboardStats({
          totalStudents: students.length,
          facultyMembers: faculty.length,
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

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setShowEditForm(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    setDeleteLoading(userId);
    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchUsers(); // Refresh the user list
      } else {
        const data = await response.json();
        alert(`Failed to delete user: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    } finally {
      setDeleteLoading(null);
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
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Welcome Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="bg-primary p-3 rounded-full">
            <FiUser className="h-8 w-8 text-white" />
          </div>
          <div className="mt-4 md:mt-0 md:ml-4">
            <h2 className="text-xl font-bold text-gray-900">Welcome, Administrator</h2>
            <p className="text-sm text-gray-500">University Attendance System</p>
          </div>
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
      </div>
      
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEditUser(user)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <FiEdit className="inline h-4 w-4" />
                      <span className="ml-1">Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={deleteLoading === user._id}
                    >
                      {deleteLoading === user._id ? (
                        <>
                          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span>
                          <span className="ml-1">Deleting...</span>
                        </>
                      ) : (
                        <>
                          <FiTrash2 className="inline h-4 w-4" />
                          <span className="ml-1">Delete</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add User Modal */}
      {showAddForm && (
        <AddUserForm 
          onClose={() => setShowAddForm(false)}
          onSuccess={handleAddUserSuccess}
        />
      )}

      {/* Edit User Modal */}
      {showEditForm && selectedUser && (
        <EditUserForm
          user={selectedUser}
          onClose={() => {
            setShowEditForm(false);
            setSelectedUser(null);
          }}
          onSuccess={handleAddUserSuccess}
        />
      )}
    </div>
  );
} 