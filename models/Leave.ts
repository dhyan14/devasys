import mongoose, { Schema, models } from 'mongoose';

export interface ILeave {
  _id?: string;
  studentId: Schema.Types.ObjectId;
  facultyId: Schema.Types.ObjectId;
  fromDate: Date;
  toDate: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  remarks?: string;
  appliedBy: Schema.Types.ObjectId; // Can be parent or student
}

const leaveSchema = new Schema<ILeave>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
    },
    facultyId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Faculty is required'],
    },
    fromDate: {
      type: Date,
      required: [true, 'From date is required'],
    },
    toDate: {
      type: Date,
      required: [true, 'To date is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    remarks: {
      type: String,
    },
    appliedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Applicant is required'],
    },
  },
  {
    timestamps: true,
  }
);

export const Leave = models.Leave || mongoose.model<ILeave>('Leave', leaveSchema); 