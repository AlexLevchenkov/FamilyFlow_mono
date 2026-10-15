import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app: Express = express();

// Global middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

export default app;
