import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'tpo', 'recruiter'],
      required: true,
    },
    branch: {
      type: String,
    },
    cgpa: {
      type: Number,
    },
    company: {
      type: String,
    },
    designation: {
      type: String,
    },
    skills: {
      type: [String],
      default: [],
    },
    phone: {
      type: String,
    },
    bio: {
      type: String,
    },
    rollNo: {
      type: String,
    },
    graduationYear: {
      type: String,
    },
    resumeFileName: {
      type: String,
    },
    resumeOriginalName: {
      type: String,
    },
    resumeUploadedAt: {
      type: Date,
    },
    links: [
      {
        label: { type: String },
        url: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
