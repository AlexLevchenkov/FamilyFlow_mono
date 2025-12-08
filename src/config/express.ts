import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app: Express = express();

// Global middleware
app.use(cors());
app.use(express.json());
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true,
    })
);
app.use(cookieParser());

export default app;
