import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';

dotenv.config();

// Resolve __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists on every start (so a fresh clone works without manual setup)
const uploadsDir = path.join(__dirname, 'uploads', 'resumes');
fs.mkdirSync(uploadsDir, { recursive: true });

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve uploaded files as static assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PlacementPulse backend is running' });
});

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'PlacementPulse API Server Active',
    health: '/api/health',
    auth: '/api/auth',
    users: '/api/users',
  });
});

app.listen(PORT, () => {
  console.log(`PlacementPulse backend is running on http://localhost:${PORT}`);
});
