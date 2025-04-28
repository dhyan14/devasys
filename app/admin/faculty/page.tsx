'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiUserPlus } from 'react-icons/fi';

// Define a faculty interface
interface Faculty {
  _id: string;
  name: string;
  email: string;
  subjects: string[];
}

// Mocked data for initial development
const FACULTY_DATA: Faculty[] = [
  { _id: '1', name: 'Dr. John Smith', email: 'john.smith@example.com', subjects: ['Mathematics', 'Physics'] },
  { _id: '2', name: 'Prof. Jane Doe', email: 'jane.doe@example.com', subjects: ['Chemistry', 'Biology'] },
];

export default function FacultyManagementPage() {
  const [faculty, setFaculty] = useState([] as Faculty[]);
  const [loading, setLoading] = useState(true);
  
  // Load faculty data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFaculty(FACULTY_DATA);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Faculty</h1>
        <Link
          href="/admin/faculty/add"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add New Faculty
        </Link>
      </div>
      
      {/* Faculty List */}
      <div className="bg-white shadow rounded-lg p-4">
        {loading ? (
          <p>Loading faculty data...</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {faculty.map((teacher) => (
              <li key={teacher._id} className="py-4">
                <h3 className="text-lg font-medium">{teacher.name}</h3>
                <p className="text-gray-600">{teacher.email}</p>
                <div className="mt-2 flex flex-wrap">
                  {teacher.subjects.map((subject, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full mr-2 mb-1 text-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
                <div className="mt-2">
                  <Link
                    href={`/admin/faculty/edit/${teacher._id}`}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure?')) {
                        setFaculty(faculty.filter(f => f._id !== teacher._id));
                      }
                    }}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 