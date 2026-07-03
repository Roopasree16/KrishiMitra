const express = require('express');
const cors = require('cors');
const schemeRoutes = require('./routes/schemeRoutes');
const loanRoutes = require('./routes/loanRoutes');

const app = express();
const PORT = 5006;

// Middleware
app.use(cors());
app.use(express.json());

// Basic request logging (development/debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Government Scheme & Loan Eligibility Advisory System',
    version: '1.0.0',
    status: 'active',
    disclaimer: 'This system provides guidance only and does not process applications.',
    endpoints: {
      schemes: 'POST /api/recommend/schemes',
      loans: 'POST /api/recommend/loans'
    }
  });
});

// Routes
app.use('/api/recommend', schemeRoutes);
app.use('/api/recommend', loanRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: 'The requested endpoint does not exist'
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

module.exports = app;
