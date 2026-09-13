const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Root Endpoint - Welcome & API Info Page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PlacementPulse Backend API</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          background-color: #0f172a;
          color: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
        }
        .card {
          background: #1e293b;
          border: 1px solid #334155;
          padding: 2.5rem;
          border-radius: 1rem;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        }
        .status {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          padding: 0.35rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .dot {
          width: 8px;
          height: 8px;
          background-color: #10b981;
          border-radius: 50%;
        }
        h1 { margin: 0 0 0.5rem 0; font-size: 1.75rem; }
        p { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem; }
        ul { list-style: none; padding: 0; margin: 0; }
        li {
          background: #0f172a;
          border: 1px solid #334155;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          margin-bottom: 0.5rem;
          display: flex;
          justify-content: space-between;
          font-family: monospace;
          font-size: 0.9rem;
        }
        a { color: #38bdf8; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="status"><span class="dot"></span> Server Active</div>
        <h1>PlacementPulse Backend API</h1>
        <p>The Node.js & Express API backend for PlacementPulse is running successfully.</p>
        
        <h3>Available API Routes:</h3>
        <ul>
          <li><span>GET /api/health</span> <a href="/api/health" target="_blank">View ↗</a></li>
          <li><span>GET /api/drives</span> <a href="/api/drives" target="_blank">View ↗</a></li>
        </ul>
      </div>
    </body>
    </html>
  `);
});

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
