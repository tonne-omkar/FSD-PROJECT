import express from 'express';
import Drive from '../models/Drive.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/drives
router.post('/', protect, authorize('tpo', 'recruiter'), async (req, res) => {
  try {
    const { title, description, eligibleBranches, minCgpa, skillsRequired } = req.body;
    let company = req.body.company;

    if (req.user.role === 'recruiter') {
      company = req.user.company;
    }

    if (
      !title ||
      !title.trim() ||
      !company ||
      !company.trim() ||
      !description ||
      !description.trim()
    ) {
      return res.status(400).json({ message: 'Title, company, and description are required' });
    }

    const drive = new Drive({
      title: title.trim(),
      company: company.trim(),
      description: description.trim(),
      eligibleBranches: eligibleBranches || [],
      minCgpa: minCgpa !== undefined ? minCgpa : undefined,
      skillsRequired: skillsRequired || [],
      postedBy: req.user._id,
    });

    const createdDrive = await drive.save();
    return res.status(201).json(createdDrive);
  } catch (error) {
    console.error('Error creating drive:', error);
    return res.status(500).json({ message: 'Server error creating drive' });
  }
});

// GET /api/drives
router.get('/', protect, async (req, res) => {
  try {
    const drives = await Drive.find({}).sort({ createdAt: -1 });
    return res.json(drives);
  } catch (error) {
    console.error('Error fetching drives:', error);
    return res.status(500).json({ message: 'Server error fetching drives' });
  }
});

export default router;
