import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: "ok", message: "PlacementPulse backend is running" });
});

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'PlacementPulse API Server Active',
    health: '/api/health',
    auth: '/api/auth',
  });
});

app.listen(PORT, () => {
  console.log(`PlacementPulse backend is running on http://localhost:${PORT}`);
});
