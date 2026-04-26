require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { startCron } = require('./cron/ngoTransferJob');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();
startCron();

// Security & Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Interceptor for displaying connection errors beautifully on frontend
app.use((req, res, next) => {
  if (global.dbError) {
    return res.status(500).json({ message: `SERVER BOOT ERROR: Database connection failed. Details: ${global.dbError}. Please check Vercel Env Vars and MongoDB IP Whitelist.` });
  }
  next();
});

// Rate Limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api', limiter);

// Static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5001;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`🚀 BeWay Server running on http://localhost:${PORT}`));
}

// Export for serverless environments (Vercel)
module.exports = app;
