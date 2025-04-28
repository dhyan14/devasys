'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import { FiCalendar } from 'react-icons/fi';
import "react-datepicker/dist/react-datepicker.css";
import { toast, Toaster } from 'react-hot-toast';

// Mock faculty data
const FACULTY = [
  { _id: '1', name: 'Dr. Smith', subject: 'Mathematics' },
  { _id: '2', name: 'Dr. Johnson', subject: 'Physics' },
  { _id: '3', name: 'Prof. Williams', subject: 'Computer Science' },
];

// Mock student data
const STUDENT = {
  _id: '123',
  name: 'John Doe',
  class: '10th Grade',
  rollNumber: 'A12345'
};

export default function ApplyLeavePage() {
  const router = useRouter();
  const [fromDate, setFromDate] = useState<Date | null>(new Date());
  const [toDate, setToDate] = useState<Date | null>(new Date());
  const [facultyId, setFacultyId] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fromDate || !toDate || !facultyId || !reason.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (fromDate > toDate) {
      toast.error('From date cannot be after to date');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, make actual API call
      // const response = await fetch('/api/leave', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     fromDate,
      //     toDate,
      //     facultyId,
      //     reason,
      //     studentId: STUDENT._id
      //   }),
      // });
      
      toast.success('Leave application submitted successfully');
      
      // Redirect after successful submission
      setTimeout(() => {
        router.push('/parent/leaves');
      }, 1500);
    } catch (error) {
      console.error('Error submitting leave application:', error);
      toast.error('Failed to submit leave application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <h1 className="text-2xl font-bold mb-6">Apply for Leave</h1>
      
      {/* Student Information */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Student Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{STUDENT.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Class</p>
            <p className="font-medium">{STUDENT.class}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Roll Number</p>
            <p className="font-medium">{STUDENT.rollNumber}</p>
          </div>
        </div>
      </div>
      
      {/* Leave Application Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Leave Details</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* From Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DatePicker
                  selected={fromDate}
                  onChange={setFromDate}
                  selectsStart
                  startDate={fromDate}
                  endDate={toDate}
                  minDate={new Date()}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                  dateFormat="MMMM d, yyyy"
                />
                <FiCalendar className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            
            {/* To Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DatePicker
                  selected={toDate}
                  onChange={setToDate}
                  selectsEnd
                  startDate={fromDate}
                  endDate={toDate}
                  minDate={fromDate}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                  dateFormat="MMMM d, yyyy"
                />
                <FiCalendar className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Faculty Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Faculty <span className="text-red-500">*</span>
            </label>
            <select
              value={facultyId}
              onChange={(e) => setFacultyId(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
              required
            >
              <option value="">Select Faculty</option>
              {FACULTY.map(faculty => (
                <option key={faculty._id} value={faculty._id}>
                  {faculty.name} - {faculty.subject}
                </option>
              ))}
            </select>
          </div>
          
          {/* Reason */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Leave <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Please provide a detailed reason for the leave"
              required
            ></textarea>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 