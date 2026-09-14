import mongoose from 'mongoose';

const recruitmentRoundSchema = new mongoose.Schema(
  {
    round: { type: Number },
    title: { type: String },
    mode: { type: String },
    duration: { type: String },
  },
  { _id: false }
);

const driveSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String },
    eligibleBranches: [{ type: String }],
    minCgpa: { type: Number },
    skillsRequired: [{ type: String }],
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String },
    ctc: { type: String },
    ctcNumber: { type: Number },
    deadline: { type: String },
    location: { type: String },
    jobType: { type: String },
    workMode: { type: String },
    status: { type: String, default: 'Open' },
    bondPeriod: { type: String },
    perks: [{ type: String }],
    responsibilities: [{ type: String }],
    recruitmentRounds: [recruitmentRoundSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Drive', driveSchema);
