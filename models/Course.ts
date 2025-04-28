import mongoose, { Schema, models } from 'mongoose';

export interface ICourse {
  _id?: string;
  name: string;
  code: string;
  description?: string;
  facultyId: Schema.Types.ObjectId;
}

const courseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: [true, 'Course name is required'],
    },
    code: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
    },
    description: {
      type: String,
    },
    facultyId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Faculty is required'],
    },
  },
  {
    timestamps: true,
  }
);

export const Course = models.Course || mongoose.model<ICourse>('Course', courseSchema); 