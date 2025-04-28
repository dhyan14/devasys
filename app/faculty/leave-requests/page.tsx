'use client';

import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

interface LeaveRequest {
  _id: string;
  studentName: string;
  studentId: string;
  reason: string;
  fromDate: string;
  toDate: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function LeaveRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Sample leave requests for demo
  const sampleLeaveRequests: LeaveRequest[] = [
    {
      _id: '1',
      studentName: 'John Doe',
      studentId: 'STU001',
      reason: 'Medical appointment',
      fromDate: '2023-06-15',
      toDate: '2023-06-16',
      status: 'pending',
      createdAt: '2023-06-10T09:30:00'
    },
    {
      _id: '2',
      studentName: 'Jane Smith',
      studentId: 'STU002',
      reason: 'Family emergency',
      fromDate: '2023-06-18',
      toDate: '2023-06-20',
      status: 'pending',
      createdAt: '2023-06-12T14:45:00'
    },
    {
      _id: '3',
      studentName: 'Alice Johnson',
      studentId: 'STU003',
      reason: 'Participation in national competition',
      fromDate: '2023-06-25',
      toDate: '2023-06-28',
      status: 'pending',
      createdAt: '2023-06-14T11:20:00'
    }
  ];

  useEffect(() => {
    // In a real app, fetch from API
    // This is just a simulation
    const fetchLeaveRequests = async () => {
      try {
        // const response = await fetch('/api/faculty/leave-requests');
        // if (response.ok) {
        //   const data = await response.json();
        //   setLeaveRequests(data.leaveRequests);
        // }
        
        // Using sample data for now
        setTimeout(() => {
          setLeaveRequests(sampleLeaveRequests);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  const handleApproveRequest = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      // In a real app, call API to approve request
      // const response = await fetch(`/api/faculty/leave-requests/${requestId}/approve`, {
      //   method: 'POST'
      // });
      
      // if (response.ok) {
      //   // Update the UI after successful approval
      //   setLeaveRequests(prev => 
      //     prev.map(req => req._id === requestId ? {...req, status: 'approved'} : req)
      //   );
      // }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setLeaveRequests(prev => 
        prev.map(req => req._id === requestId ? {...req, status: 'approved'} : req)
      );
    } catch (error) {
      console.error('Error approving request:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      // In a real app, call API to reject request
      // const response = await fetch(`/api/faculty/leave-requests/${requestId}/reject`, {
      //   method: 'POST'
      // });
      
      // if (response.ok) {
      //   // Update the UI after successful rejection
      //   setLeaveRequests(prev => 
      //     prev.map(req => req._id === requestId ? {...req, status: 'rejected'} : req)
      //   );
      // }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setLeaveRequests(prev => 
        prev.map(req => req._id === requestId ? {...req, status: 'rejected'} : req)
      );
    } catch (error) {
      console.error('Error rejecting request:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/faculty/dashboard" className="mr-4">
          <FiArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Student Leave Requests</h1>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading leave requests...</p>
        </div>
      ) : leaveRequests.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">No pending leave requests</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <ul className="divide-y divide-gray-200">
            {leaveRequests.map(request => (
              <li key={request._id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-semibold">{request.studentName}</h3>
                    <p className="text-gray-600">Student ID: {request.studentId}</p>
                    <p className="mt-2"><span className="font-medium">Reason:</span> {request.reason}</p>
                    <p className="mt-1">
                      <span className="font-medium">Duration:</span> {formatDate(request.fromDate)} to {formatDate(request.toDate)}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Requested on {formatDate(request.createdAt)}
                    </p>
                  </div>
                  
                  <div className="flex space-x-4">
                    {request.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApproveRequest(request._id)}
                          disabled={actionLoading === request._id}
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          {actionLoading === request._id ? (
                            <span className="animate-pulse">Processing...</span>
                          ) : (
                            <>
                              <FiCheck className="mr-2" />
                              Approve
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request._id)}
                          disabled={actionLoading === request._id}
                          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          {actionLoading === request._id ? (
                            <span className="animate-pulse">Processing...</span>
                          ) : (
                            <>
                              <FiX className="mr-2" />
                              Reject
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        request.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {request.status === 'approved' ? 'Approved' : 'Rejected'}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 