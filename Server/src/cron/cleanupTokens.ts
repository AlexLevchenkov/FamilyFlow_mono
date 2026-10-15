import cron from 'node-cron';
import authService from '@services/auth.service';

// Run cleanup every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    await authService._removeAllOldTokens();
    console.log('Successfully cleaned up expired tokens');
  } catch (error: any) {
    console.error('Error cleaning up expired tokens:', error);
  }
});
