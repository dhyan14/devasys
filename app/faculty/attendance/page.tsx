'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast, Toaster } from 'react-hot-toast';
import { FiCalendar, FiCheck, FiX, FiSave } from 'react-icons/fi';

interface Student {
  _id: string;
  name: string;
  email: string;
  enrollmentNumber?: string;
  department?: string;
}

interface Subject {
  _id: string;
  name: string;
  code: string;
}

export default function FacultyAttendance() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<{[key: string]: 'present' | 'absent' | 'leave'}>({});
  const [remarks, setRemarks] = useState<{[key: string]: string}>({});
  const [savingAttendance, setSavingAttendance] = useState(false);
  
  // Load subjects when component mounts
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        // In a real app, fetch subjects from API
        const response = await fetch('/api/faculty/subjects');
        
        if (response.ok) {
          const data = await response.json();
          setSubjects(data.subjects);
        } else {
          // Fallback to sample data if API fails
          setSubjects([
            { _id: '1', name: 'Mathematics', code: 'MATH101' },
            { _id: '2', name: 'Physics', code: 'PHYS101' },
            { _id: '3', name: 'Computer Science', code: 'CS101' },
          ]);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
        // Fallback to sample data
        setSubjects([
          { _id: '1', name: 'Mathematics', code: 'MATH101' },
          { _id: '2', name: 'Physics', code: 'PHYS101' },
          { _id: '3', name: 'Computer Science', code: 'CS101' },
        ]);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, []);
  
  // Load students when subject is selected
  useEffect(() => {
    if (selectedSubject) {
      setLoadingStudents(true);
      
      const fetchStudents = async () => {
        try {
          // In a real app, fetch students for this subject
          const response = await fetch(`/api/faculty/students?subjectId=${selectedSubject}`);
          
          if (response.ok) {
            const data = await response.json();
            setStudents(data.students);
            
            // Initialize attendance status
            const initialAttendance: {[key: string]: 'present' | 'absent' | 'leave'} = {};
            data.students.forEach((student: Student) => {
              initialAttendance[student._id] = 'present';
            });
            setAttendance(initialAttendance);
          } else {
            toast.error('Failed to load students');
            setStudents([]);
          }
        } catch (error) {
          console.error('Error fetching students:', error);
          toast.error('Error loading students');
          setStudents([]);
        } finally {
          setLoadingStudents(false);
        }
      };

      fetchStudents();
    } else {
      setStudents([]);
      setAttendance({});
    }
  }, [selectedSubject]);

  // Handle attendance status change
  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'leave') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  // Handle remarks change
  const handleRemarksChange = (studentId: string, value: string) => {
    setRemarks(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  // Save attendance
  const saveAttendance = async () => {
    if (!date || !selectedSubject || students.length === 0) {
      toast.error('Please select date and subject');
      return;
    }

    setSavingAttendance(true);
    // Prepare attendance data
    const records = students.map(student => ({
      studentId: student._id,
      status: attendance[student._id] || 'absent',
      remarks: remarks[student._id] || ''
    }));

    try {
      // In a real app, make actual API call
      const response = await fetch('/api/faculty/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: date.toISOString(),
          subjectId: selectedSubject,
          records
        }),
      });
      
      if (response.ok) {
        toast.success('Attendance saved successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to save attendance');
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('Failed to save attendance');
    } finally {
      setSavingAttendance(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <h1 className="text-2xl font-bold mb-6">Record Attendance</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <div className="relative">
              <DatePicker
                selected={date}
                onChange={setDate}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                dateFormat="MMMM d, yyyy"
              />
              <FiCalendar className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
          
          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
              disabled={loadingSubjects}
            >
              <option value="">Select Subject</option>
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Student Attendance List */}
      {selectedSubject ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Student Attendance</h2>
          
          {loadingStudents ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4">Loading students...</p>
            </div>
          ) : students.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map(student => (
                      <tr key={student._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.email}</div>
                              {student.enrollmentNumber && (
                                <div className="text-xs text-gray-400">ID: {student.enrollmentNumber}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center space-x-4">
                            <button
                              type="button"
                              onClick={() => handleAttendanceChange(student._id, 'present')}
                              className={`p-2 rounded-full ${attendance[student._id] === 'present' ? 'bg-green-100 text-green-800 ring-2 ring-green-600' : 'bg-gray-100 text-gray-600 hover:bg-green-50'}`}
                            >
                              <FiCheck className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAttendanceChange(student._id, 'absent')}
                              className={`p-2 rounded-full ${attendance[student._id] === 'absent' ? 'bg-red-100 text-red-800 ring-2 ring-red-600' : 'bg-gray-100 text-gray-600 hover:bg-red-50'}`}
                            >
                              <FiX className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAttendanceChange(student._id, 'leave')}
                              className={`p-2 rounded-full ${attendance[student._id] === 'leave' ? 'bg-yellow-100 text-yellow-800 ring-2 ring-yellow-600' : 'bg-gray-100 text-gray-600 hover:bg-yellow-50'}`}
                            >
                              <span className="text-xs font-bold">L</span>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={remarks[student._id] || ''}
                            onChange={(e) => handleRemarksChange(student._id, e.target.value)}
                            placeholder="Optional remarks"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={saveAttendance}
                  disabled={savingAttendance}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {savingAttendance ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2 h-4 w-4" />
                      Save Attendance
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No students found for this subject
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
          Please select a subject to view students
        </div>
      )}
    </div>
  );
} 