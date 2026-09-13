import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: "ok", message: "PlacementPulse backend is running" });
});

app.listen(PORT, () => {
  console.log(`PlacementPulse backend is running on http://localhost:${PORT}`);
});
