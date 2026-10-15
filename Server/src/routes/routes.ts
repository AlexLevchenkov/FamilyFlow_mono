import { Express } from 'express';
import authRouter from './auth.routes';
import listRouter from './list.routes';
import itemListRouter from './listItem.routes';
import userRouter from './user.routes';
import { authenticate } from '@/middleware';

function setupRoutes(app: Express): void {
  app.use('/auth', authRouter);
  app.use('/list', authenticate, listRouter);
  app.use('/user', userRouter);
  app.use('/listItem', authenticate, itemListRouter);
}

export default setupRoutes;
