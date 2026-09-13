import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Resolve __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Multer configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'resumes'));
  },
  filename: (req, file, cb) => {
    // Pattern: <userId>-<timestamp>-<originalname>
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${req.user.id}-${Date.now()}-${safeName}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(
      Object.assign(new Error('Only PDF files are accepted for resume uploads'), {
        code: 'INVALID_FILE_TYPE',
      }),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// POST /api/users/resume — upload resume (protected)
router.post('/resume', protect, (req, res) => {
  upload.single('resume')(req, res, async (err) => {
    // Handle multer errors
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum allowed resume size is 5 MB.',
        });
      }
      if (err.code === 'INVALID_FILE_TYPE') {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(400).json({ success: false, message: err.message });
    }

    // No file in the request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided. Please attach a PDF resume.',
      });
    }

    // Persist resume metadata to MongoDB
    try {
      await User.findByIdAndUpdate(req.user.id, {
        resumeFileName: req.file.filename,
        resumeOriginalName: req.file.originalname,
        resumeUploadedAt: new Date(),
      });

      return res.status(200).json({
        success: true,
        resumeUrl: `/uploads/resumes/${req.file.filename}`,
        originalName: req.file.originalname,
      });
    } catch (dbError) {
      console.error('Resume DB update failed:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Resume saved to disk but failed to update user record. Please try again.',
      });
    }
  });
});

// Helper — safe URL validation using the URL constructor (no regex, no backtracking)
const isValidUrl = (value) => {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

// PUT /api/users/me — update own profile (protected)
router.put('/me', protect, async (req, res) => {
  const { branch, cgpa, skills, phone, bio, rollNo, graduationYear, links } = req.body;

  // Validate every link's URL before touching the DB (all-or-nothing)
  if (links !== undefined) {
    if (!Array.isArray(links)) {
      return res.status(400).json({ success: false, message: 'links must be an array of { label, url } objects' });
    }
    for (const link of links) {
      if (!link.url || !isValidUrl(link.url)) {
        return res.status(400).json({
          success: false,
          message: `Invalid URL for link "${link.label || '(no label)'}": "${link.url}". Must be a valid http/https URL.`,
        });
      }
    }
  }

  try {
    // Only patch fields that were actually sent — never overwrite with undefined
    const updates = {};
    if (branch       !== undefined) updates.branch       = branch;
    if (cgpa         !== undefined) updates.cgpa         = cgpa;
    if (skills       !== undefined) updates.skills       = skills;
    if (phone        !== undefined) updates.phone        = phone;
    if (bio          !== undefined) updates.bio          = bio;
    if (rollNo       !== undefined) updates.rollNo       = rollNo;
    if (graduationYear !== undefined) updates.graduationYear = graduationYear;
    if (links        !== undefined) updates.links        = links;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        branch: updatedUser.branch,
        cgpa: updatedUser.cgpa,
        skills: updatedUser.skills,
        company: updatedUser.company,
        designation: updatedUser.designation,
        phone: updatedUser.phone,
        bio: updatedUser.bio,
        rollNo: updatedUser.rollNo,
        graduationYear: updatedUser.graduationYear,
        links: updatedUser.links,
        resumeFileName: updatedUser.resumeFileName,
        resumeOriginalName: updatedUser.resumeOriginalName,
        resumeUploadedAt: updatedUser.resumeUploadedAt,
      },
    });
  } catch (error) {
    console.error('Profile update failed:', error);
    return res.status(500).json({ success: false, message: 'Failed to update profile. Please try again.' });
  }
});

export default router;

