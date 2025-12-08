import { Express } from 'express';
import authRouter from '@routes/auth.routes';
import userRouter from '@routes/user.routes';
import authenticate from '@middleware/auth';

function setupRoutes(app: Express): void {
  app.use('/auth', authRouter);
  app.use('/users', userRouter);
  // app.use('/users', authenticate, userRouter);
}

export default setupRoutes;
