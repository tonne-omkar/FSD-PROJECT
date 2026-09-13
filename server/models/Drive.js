import mongoose from 'mongoose';

const driveSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String },
    eligibleBranches: [{ type: String }],
    minCgpa: { type: Number },
    skillsRequired: [{ type: String }],
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Drive', driveSchema);
