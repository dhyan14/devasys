'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiEdit2, FiTrash2, FiUserPlus, FiSearch } from 'react-icons/fi';
import { toast, Toaster } from 'react-hot-toast';

// Mocked data for initial development
// Replace with actual API calls in production
const FACULTY_DATA = [
  { _id: '1', name: 'Dr. John Smith', email: 'john.smith@example.com', subjects: ['Mathematics', 'Physics'] },
  { _id: '2', name: 'Prof. Jane Doe', email: 'jane.doe@example.com', subjects: ['Chemistry', 'Biology'] },
  { _id: '3', name: 'Dr. Michael Johnson', email: 'michael.johnson@example.com', subjects: ['Computer Science'] },
  { _id: '4', name: 'Prof. Sarah Williams', email: 'sarah.williams@example.com', subjects: ['English Literature'] },
  { _id: '5', name: 'Dr. Robert Brown', email: 'robert.brown@example.com', subjects: ['History', 'Geography'] },
];

export default function FacultyManagementPage() {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [filteredFaculty, setFilteredFaculty] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Load faculty data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFaculty(FACULTY_DATA);
      setFilteredFaculty(FACULTY_DATA);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle search
  useEffect(() => {
    if (faculty.length === 0) return;
    
    if (!searchTerm.trim()) {
      setFilteredFaculty(faculty);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = faculty.filter(
      teacher => 
        teacher.name.toLowerCase().includes(term) || 
        teacher.email.toLowerCase().includes(term) ||
        teacher.subjects.some((subject: string) => subject.toLowerCase().includes(term))
    );
    
    setFilteredFaculty(filtered);
  }, [searchTerm, faculty]);

  // Handle delete faculty
  const handleDeleteFaculty = (id: string) => {
    if (confirm('Are you sure you want to delete this faculty member?')) {
      // In production, make actual API call
      // await fetch(`/api/faculty/${id}`, { method: 'DELETE' });
      
      // Update local state
      const updatedFaculty = faculty.filter(teacher => teacher._id !== id);
      setFaculty(updatedFaculty);
      setFilteredFaculty(updatedFaculty);
      
      toast.success('Faculty member deleted successfully');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Faculty</h1>
        <Link
          href="/admin/faculty/add"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <FiUserPlus className="mr-2 h-4 w-4" />
          Add New Faculty
        </Link>
      </div>
      
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Search faculty by name, email or subject..."
          />
        </div>
      </div>
      
      {/* Faculty List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="px-4 py-12 text-center">
            <p>Loading faculty data...</p>
          </div>
        ) : filteredFaculty.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredFaculty.map((teacher) => (
              <li key={teacher._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="sm:flex sm:justify-start sm:flex-1">
                      <div>
                        <h3 className="text-lg font-medium text-primary truncate">{teacher.name}</h3>
                        <p className="mt-1 text-sm text-gray-600 truncate">{teacher.email}</p>
                        <div className="mt-2 flex flex-wrap">
                          {teacher.subjects.map((subject: string, index: number) => (
                            <span 
                              key={index}
                              className="px-2 py-1 text-xs font-medium bg-primary-dark bg-opacity-10 text-primary-dark rounded-full mr-2 mb-1"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0 flex space-x-2">
                      <Link
                        href={`/admin/faculty/edit/${teacher._id}`}
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteFaculty(teacher._id)}
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-12 text-center">
            <p className="text-gray-500">No faculty members found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
} 