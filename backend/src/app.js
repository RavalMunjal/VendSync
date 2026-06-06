import 'express-async-errors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'BidFlow API running' });
});

// Fallback for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

export default app;
