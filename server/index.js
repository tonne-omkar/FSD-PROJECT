const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PlacementPulse Backend API',
    timestamp: new Date().toISOString(),
  });
});

// Sample API Route for Drives
app.get('/api/drives', (req, res) => {
  res.json({
    success: true,
    message: 'PlacementPulse drives retrieved successfully',
    data: [],
  });
});

app.listen(PORT, () => {
  console.log(`PlacementPulse backend running on http://localhost:${PORT}`);
});
