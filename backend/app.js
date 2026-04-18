import express from 'express';
import cors from 'cors';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Body parser

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/stats', statsRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
