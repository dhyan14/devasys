'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiUser, FiUsers, FiMail, FiCalendar } from 'react-icons/fi';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Fetching users from MongoDB...');
        const response = await fetch('/api/admin/users');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Retrieved ${data.users.length} users from MongoDB`);
        setUsers(data.users);
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err.message || 'Failed to load users from MongoDB');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'faculty':
        return 'bg-blue-100 text-blue-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      case 'parent':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link 
          href="/admin/dashboard" 
          className="flex items-center text-gray-700 hover:text-primary mr-4"
        >
          <FiArrowLeft className="mr-2" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold">MongoDB User Management</h1>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">MongoDB User Database</h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {users.length} Total Users
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <FiUser className="text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Admins</p>
                    <p className="text-xl font-semibold">{users.filter(u => u.role === 'admin').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FiUsers className="text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Faculty</p>
                    <p className="text-xl font-semibold">{users.filter(u => u.role === 'faculty').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FiUsers className="text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Students</p>
                    <p className="text-xl font-semibold">{users.filter(u => u.role === 'student').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <FiUsers className="text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Parents</p>
                    <p className="text-xl font-semibold">{users.filter(u => u.role === 'parent').length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">All Users in MongoDB</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      MongoDB ID
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-500 font-mono">{user._id}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 