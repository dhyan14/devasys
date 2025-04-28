import mongoose, { Schema, models } from 'mongoose';

export type UserRole = 'admin' | 'faculty' | 'student' | 'parent';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  profilePicture?: string;
  studentId?: Schema.Types.ObjectId; // For parent role
  facultyId?: Schema.Types.ObjectId; // For student role (assigned faculty)
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['admin', 'faculty', 'student', 'parent'],
      required: [true, 'Role is required'],
    },
    profilePicture: {
      type: String,
      default: '',
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    facultyId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export const User = models.User || mongoose.model<IUser>('User', userSchema); 