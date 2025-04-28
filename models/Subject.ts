import mongoose, { Schema, models } from 'mongoose';

export interface ISubject {
  _id?: string;
  name: string;
  code: string;
  courseId: Schema.Types.ObjectId;
  facultyId: Schema.Types.ObjectId;
}

const subjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
    },
    code: {
      type: String,
      required: [true, 'Subject code is required'],
      unique: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
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

export const Subject = models.Subject || mongoose.model<ISubject>('Subject', subjectSchema); 