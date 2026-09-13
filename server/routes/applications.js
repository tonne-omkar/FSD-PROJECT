import express from 'express';
import Application from '../models/Application.js';
import Drive from '../models/Drive.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/applications
router.post('/', protect, authorize('student'), async (req, res) => {
  try {
    const { driveId } = req.body;

    if (!driveId) {
      return res.status(400).json({ message: 'driveId is required' });
    }

    const drive = await Drive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    const existingApplication = await Application.findOne({
      student: req.user._id,
      drive: driveId,
    });

    if (existingApplication) {
      return res.status(409).json({ message: 'You have already applied to this drive.' });
    }

    const application = new Application({
      student: req.user._id,
      drive: driveId,
      company: drive.company,
      status: 'Applied',
    });

    const savedApplication = await application.save();
    return res.status(201).json(savedApplication);
  } catch (error) {
    console.error('Error creating application:', error);
    return res.status(500).json({ message: 'Server error creating application' });
  }
});

// GET /api/applications
router.get('/', protect, async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'student') {
      filter = { student: req.user._id };
    } else if (req.user.role === 'recruiter') {
      filter = { company: req.user.company };
    } else if (req.user.role === 'tpo') {
      filter = {};
    }

    const applications = await Application.find(filter)
      .populate('student', 'name email branch cgpa skills')
      .populate('drive', 'title company')
      .sort({ createdAt: -1 });

    return res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return res.status(500).json({ message: 'Server error fetching applications' });
  }
});

export default router;
