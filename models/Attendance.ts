import mongoose, { Schema, models } from 'mongoose';

export interface IAttendance {
  _id?: string;
  date: Date;
  studentId: Schema.Types.ObjectId;
  subjectId: Schema.Types.ObjectId;
  status: 'present' | 'absent' | 'leave';
  remarks?: string;
  createdBy: Schema.Types.ObjectId;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required'],
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'leave'],
      required: [true, 'Status is required'],
    },
    remarks: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index for unique attendance records per student per subject per date
attendanceSchema.index({ date: 1, studentId: 1, subjectId: 1 }, { unique: true });

export const Attendance = models.Attendance || mongoose.model<IAttendance>('Attendance', attendanceSchema); 