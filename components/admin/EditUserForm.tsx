'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiCheck, FiAlertTriangle } from 'react-icons/fi';

// Define our own interface without relying on the import
interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'faculty' | 'student' | 'parent';
  profilePicture?: string;
  studentId?: string;
  facultyIds?: string[];
  enrollmentNumber?: string;
}

interface FormData {
  name: string;
  email: string;
  password?: string;
  role: string;
  studentId: string;
  facultyIds: string[];
  enrollmentNumber: string;
}

interface EditUserFormProps {
  user: IUser;
  onClose: () => void;
  onSuccess: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    name: user.name || '',
    email: user.email || '',
    password: '', // Empty by default, only set if user wants to change it
    role: user.role || 'student',
    studentId: user.studentId?.toString() || '',
    facultyIds: (user.facultyIds || []).map(id => id.toString()),
    enrollmentNumber: user.enrollmentNumber || '',
  });
  
  const [students, setStudents] = useState<IUser[]>([]);
  const [faculty, setFaculty] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fetchStatus, setFetchStatus] = useState<'loading' | 'success' | 'error'>('loading');
  
  // Fetch students and faculty for relationships
  useEffect(() => {
    const fetchUsers = async () => {
      setFetchStatus('loading');
      try {
        console.log("Fetching users from API...");
        const response = await fetch('/api/admin/users');
        
        if (response.ok) {
          const data = await response.json();
          console.log(`Retrieved ${data.users.length} users from database`);
          
          setStudents(data.users.filter((user: IUser) => user.role === 'student'));
          setFaculty(data.users.filter((user: IUser) => user.role === 'faculty'));
          setFetchStatus('success');
        } else {
          console.error('Failed to fetch users:', response.status);
          setFetchStatus('error');
          setError(`Failed to fetch users: ${response.status}`);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setFetchStatus('error');
        setError('Network error while fetching users');
      }
    };
    
    fetchUsers();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      facultyIds: options
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      console.log("Submitting form to update user...");
      
      // Create a submission object, omitting password if it's empty
      const submissionData = { ...formData };
      if (!submissionData.password) {
        delete submissionData.password;
      }
      
      // Only send fields that were actually changed
      const changesOnly: Record<string, any> = {};
      for (const [key, value] of Object.entries(submissionData)) {
        // Skip password comparison and check other fields
        if (key !== 'password') {
          // Check if the value is different from the original user value
          const userValue = (user as any)[key];
          if (JSON.stringify(value) !== JSON.stringify(userValue)) {
            changesOnly[key] = value;
          }
        } else if (value) { // Include password only if it's not empty
          changesOnly[key] = value;
        }
      }
      
      // If nothing was changed, just close the form
      if (Object.keys(changesOnly).length === 0) {
        setSuccess('No changes detected');
        setTimeout(() => onClose(), 1500);
        setLoading(false);
        return;
      }
      
      const response = await fetch(`/api/admin/users?id=${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changesOnly),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user');
      }
      
      console.log("User updated successfully:", data);
      setSuccess(`User ${formData.name} was successfully updated!`);
      
      // Notify parent component of success
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000); // Give user time to see success message
      
    } catch (err: any) {
      console.error("Error while updating user:", err);
      setError(err.message || 'An error occurred while updating the user');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit User</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <FiAlertTriangle className="text-red-500 mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
            <FiCheck className="text-green-500 mr-2" />
            <span>{success}</span>
          </div>
        )}
        
        {fetchStatus === 'loading' && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading user data...</p>
          </div>
        )}
        
        {fetchStatus === 'error' && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p>Unable to load existing users. Some features may be limited.</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password (leave empty to keep current)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Leave blank to keep current password"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="admin">Admin</option>
              <option value="faculty">Faculty</option>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
            </select>
          </div>
          
          {formData.role === 'student' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Enrollment Number
                </label>
                <input
                  type="text"
                  name="enrollmentNumber"
                  value={formData.enrollmentNumber}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  placeholder="e.g., EN2023001"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Faculty Advisors
                </label>
                <select
                  name="facultyIds"
                  multiple
                  value={formData.facultyIds}
                  onChange={handleMultiSelectChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  size={3}
                >
                  {faculty.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.name} ({f.email})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd key to select multiple faculty advisors</p>
              </div>
            </>
          )}
          
          {formData.role === 'parent' && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Student
              </label>
              <select
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                  <span>Updating...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserForm; 