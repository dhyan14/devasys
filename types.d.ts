import { Schema } from 'mongoose';

// User types
type UserRole = 'admin' | 'faculty' | 'student' | 'parent';

interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  profilePicture?: string;
  studentId?: Schema.Types.ObjectId; // For parent role
  facultyId?: Schema.Types.ObjectId; // For student role (assigned faculty)
  createdAt?: Date;
  updatedAt?: Date;
}

// Course types
interface Course {
  _id?: string;
  name: string;
  code: string;
  description?: string;
  facultyId: Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// Subject types
interface Subject {
  _id?: string;
  name: string;
  code: string;
  courseId: Schema.Types.ObjectId;
  facultyId: Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// Attendance types
type AttendanceStatus = 'present' | 'absent' | 'leave';

interface Attendance {
  _id?: string;
  date: Date;
  studentId: Schema.Types.ObjectId;
  subjectId: Schema.Types.ObjectId;
  status: AttendanceStatus;
  remarks?: string;
  createdBy: Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// Leave types
type LeaveStatus = 'pending' | 'approved' | 'rejected';

interface Leave {
  _id?: string;
  studentId: Schema.Types.ObjectId;
  facultyId: Schema.Types.ObjectId;
  fromDate: Date;
  toDate: Date;
  reason: string;
  status: LeaveStatus;
  remarks?: string;
  appliedBy: Schema.Types.ObjectId; // Can be parent or student
  createdAt?: Date;
  updatedAt?: Date;
}

// Session types
interface Session {
  user: Omit<User, 'password'>;
  role: UserRole;
}

// For population
interface PopulatedAttendance extends Omit<Attendance, 'studentId' | 'subjectId' | 'createdBy'> {
  studentId: Omit<User, 'password'>;
  subjectId: Subject;
  createdBy: Omit<User, 'password'>;
}

interface PopulatedLeave extends Omit<Leave, 'studentId' | 'facultyId' | 'appliedBy'> {
  studentId: Omit<User, 'password'>;
  facultyId: Omit<User, 'password'>;
  appliedBy: Omit<User, 'password'>;
} 