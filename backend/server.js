require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error.middleware');

// Import routes
const complaintRoutes = require('./routes/complaint.routes');
const aiRoutes = require('./routes/ai.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

// Initialize Express App
const app = express();

// Establish Mongoose Database Connection
connectDB();

// Global Middlewares
app.use(cors()); // Allow easy frontend access across different ports/domains
app.use(express.json({ limit: '10mb' })); // Support base64 image uploads inside requests
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// General Telemetry / Logger Middleware
app.use((req, res, next) => {
  console.log(`[API Call] ${new Date().toISOString()} | ${req.method} ${req.originalUrl}`);
  next();
});

// Primary API Mount Points
app.use('/api/complaints', complaintRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Server Root Health Check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to JanMitra AI - Enterprise Grievance Governance Backend API',
    version: '1.0.0',
    status: 'Operational'
  });
});

// 404 Route Catch-All
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n=============================================================`);
  console.log(`[JanMitra AI Backend] Server successfully initialized!`);
  console.log(`[JanMitra AI Backend] Active Cwd: ${process.cwd()}`);
  console.log(`[JanMitra AI Backend] Running in [${process.env.NODE_ENV || 'development'}] mode`);
  console.log(`[JanMitra AI Backend] Listening on port: http://localhost:${PORT}`);
  console.log(`=============================================================\n`);
});

// Handle graceful shutdowns for production containers
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

module.exports = app; // Expose for integration testing purposes
